import dotenv from 'dotenv';
import { WeeScraper } from './wee-scraper';

// Load environment variables
dotenv.config();

async function testScraper() {
  console.log('🔍 Starting Wee Website Scraper Test...\n');
  
  const scraper = new WeeScraper();
  
  try {
    // Test 1: Scrape main page
    console.log('📄 Test 1: Scraping main page...');
    const mainContents = await scraper.scrapeMainPage();
    console.log(`✅ Found ${mainContents.length} items on main page`);
    if (mainContents.length > 0) {
      console.log('Sample content:', mainContents[0]);
    }
    console.log('\n');
    
    // Test 2: Scrape about page
    console.log('📄 Test 2: Scraping about page...');
    const aboutContents = await scraper.scrapeAboutPage();
    console.log(`✅ Found ${aboutContents.length} items on about page`);
    if (aboutContents.length > 0) {
      console.log('Sample content:', aboutContents[0]);
    }
    console.log('\n');
    
    // Test 3: Scrape institutions
    console.log('📄 Test 3: Scraping institutions...');
    const institutions = await scraper.scrapeInstitutions();
    console.log(`✅ Found ${institutions.length} institutions`);
    if (institutions.length > 0) {
      console.log('Sample institution:', institutions[0]);
    }
    console.log('\n');
    
    // Test 4: Save to Supabase (only if explicitly enabled)
    if (process.argv.includes('--save')) {
      console.log('💾 Test 4: Saving to Supabase...');
      const results = await scraper.saveToSupabase();
      console.log('✅ Save results:', results);
    } else {
      console.log('ℹ️  To save to Supabase, run with --save flag');
    }
    
  } catch (error) {
    console.error('❌ Error during scraping:', error);
  }
}

// Run the test
testScraper();