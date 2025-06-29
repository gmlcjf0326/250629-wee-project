import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WeeContent {
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  metadata?: Record<string, any>;
  scraped_at: string;
  source_url: string;
}

interface WeeAnnouncement {
  title: string;
  content?: string;
  author?: string;
  posted_date?: string;
  views?: number;
  attachments?: string[];
  category: string;
  source_url: string;
  scraped_at: string;
}

interface WeeInstitution {
  name: string;
  type: 'class' | 'center' | 'school';
  region: string;
  address?: string;
  phone?: string;
  services?: string[];
  coordinates?: { lat: number; lng: number };
  scraped_at: string;
}

export class WeeScraper {
  private baseUrl = 'https://www.wee.go.kr';
  
  // Sample URLs based on the site structure
  private urls = {
    main: '/home/main/main.do',
    about: '/home/cms/cmsCont.do?cntnts_sn=1', // 사업소개
    history: '/home/cms/cmsCont.do?cntnts_sn=2', // 사업연혁
    system: '/home/cms/cmsCont.do?cntnts_sn=3', // 추진체계
    institutions: '/home/cms/cmsCont.do?cntnts_sn=4', // 기관현황
  };

  async scrapeMainPage(): Promise<WeeContent[]> {
    try {
      const response = await axios.get(`${this.baseUrl}${this.urls.main}`);
      const $ = cheerio.load(response.data);
      const contents: WeeContent[] = [];

      // Scrape main banner content
      $('.main-visual').each((_, element) => {
        const title = $(element).find('h2').text().trim();
        const content = $(element).find('p').text().trim();
        
        if (title) {
          contents.push({
            title,
            content,
            category: 'main',
            subcategory: 'banner',
            source_url: `${this.baseUrl}${this.urls.main}`,
            scraped_at: new Date().toISOString(),
          });
        }
      });

      // Scrape quick links
      $('.quick-menu li').each((_, element) => {
        const title = $(element).find('a').text().trim();
        const href = $(element).find('a').attr('href');
        
        if (title && href) {
          contents.push({
            title,
            content: '',
            category: 'main',
            subcategory: 'quick_link',
            metadata: { href },
            source_url: `${this.baseUrl}${this.urls.main}`,
            scraped_at: new Date().toISOString(),
          });
        }
      });

      return contents;
    } catch (error) {
      console.error('Error scraping main page:', error);
      return [];
    }
  }

  async scrapeAboutPage(): Promise<WeeContent[]> {
    try {
      const response = await axios.get(`${this.baseUrl}${this.urls.about}`);
      const $ = cheerio.load(response.data);
      const contents: WeeContent[] = [];

      // Scrape page title and content
      const pageTitle = $('.cont-tit h3').text().trim() || $('h1').first().text().trim();
      const mainContent = $('.cont-area').html() || $('article').html() || '';

      // Extract sections
      $('.cont-area section, .content-section').each((_, element) => {
        const sectionTitle = $(element).find('h4, h3').first().text().trim();
        const sectionContent = $(element).find('p').text().trim();
        
        if (sectionTitle) {
          contents.push({
            title: sectionTitle,
            content: sectionContent,
            category: 'about',
            subcategory: 'introduction',
            source_url: `${this.baseUrl}${this.urls.about}`,
            scraped_at: new Date().toISOString(),
          });
        }
      });

      // If no sections found, save the whole content
      if (contents.length === 0 && pageTitle) {
        contents.push({
          title: pageTitle,
          content: this.cleanHtml(mainContent),
          category: 'about',
          subcategory: 'general',
          source_url: `${this.baseUrl}${this.urls.about}`,
          scraped_at: new Date().toISOString(),
        });
      }

      return contents;
    } catch (error) {
      console.error('Error scraping about page:', error);
      return [];
    }
  }

  async scrapeInstitutions(): Promise<WeeInstitution[]> {
    try {
      const response = await axios.get(`${this.baseUrl}${this.urls.institutions}`);
      const $ = cheerio.load(response.data);
      const institutions: WeeInstitution[] = [];

      // Look for institution data in tables or lists
      $('table tr, .institution-item').each((_, element) => {
        const name = $(element).find('td:nth-child(1), .inst-name').text().trim();
        const type = this.determineInstitutionType(name);
        const region = $(element).find('td:nth-child(2), .inst-region').text().trim();
        const address = $(element).find('td:nth-child(3), .inst-address').text().trim();
        const phone = $(element).find('td:nth-child(4), .inst-phone').text().trim();

        if (name && region) {
          institutions.push({
            name,
            type,
            region,
            address,
            phone,
            scraped_at: new Date().toISOString(),
          });
        }
      });

      return institutions;
    } catch (error) {
      console.error('Error scraping institutions:', error);
      return [];
    }
  }

  private determineInstitutionType(name: string): 'class' | 'center' | 'school' {
    if (name.includes('클래스')) return 'class';
    if (name.includes('스쿨')) return 'school';
    return 'center';
  }

  private cleanHtml(html: string): string {
    const $ = cheerio.load(html);
    $('script, style').remove();
    return $.text().trim().replace(/\s+/g, ' ');
  }

  async saveToSupabase() {
    try {
      // Scrape all content
      const mainContents = await this.scrapeMainPage();
      const aboutContents = await this.scrapeAboutPage();
      const institutions = await this.scrapeInstitutions();

      // Save contents to Supabase
      if (mainContents.length > 0) {
        const { error: contentError } = await supabase
          .from('wee_contents')
          .insert(mainContents);
        
        if (contentError) {
          console.error('Error saving main contents:', contentError);
        } else {
          console.log(`Saved ${mainContents.length} main page contents`);
        }
      }

      if (aboutContents.length > 0) {
        const { error: aboutError } = await supabase
          .from('wee_contents')
          .insert(aboutContents);
        
        if (aboutError) {
          console.error('Error saving about contents:', aboutError);
        } else {
          console.log(`Saved ${aboutContents.length} about page contents`);
        }
      }

      if (institutions.length > 0) {
        const { error: instError } = await supabase
          .from('wee_institutions')
          .insert(institutions);
        
        if (instError) {
          console.error('Error saving institutions:', instError);
        } else {
          console.log(`Saved ${institutions.length} institutions`);
        }
      }

      return {
        mainContents: mainContents.length,
        aboutContents: aboutContents.length,
        institutions: institutions.length,
      };
    } catch (error) {
      console.error('Error in saveToSupabase:', error);
      throw error;
    }
  }
}

// Example usage
export async function runWeeScraper() {
  const scraper = new WeeScraper();
  
  try {
    const results = await scraper.saveToSupabase();
    console.log('Scraping completed:', results);
    return results;
  } catch (error) {
    console.error('Scraping failed:', error);
    throw error;
  }
}