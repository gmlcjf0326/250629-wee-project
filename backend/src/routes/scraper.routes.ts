import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkPermission } from '../middleware/permission.middleware';
import { WeeScraper } from '../scrapers/wee-scraper';

const router = Router();

// Scrape Wee website content (Admin only)
router.post('/scrape/wee', 
  authenticateToken, 
  checkPermission('manage_content'),
  async (req, res) => {
    try {
      const scraper = new WeeScraper();
      const results = await scraper.saveToSupabase();
      
      res.json({
        success: true,
        message: 'Scraping completed successfully',
        results
      });
    } catch (error) {
      console.error('Scraping error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to scrape content',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get scraped content statistics
router.get('/scrape/stats',
  authenticateToken,
  async (req, res) => {
    try {
      const { data: contentCount } = await req.supabase
        .from('wee_contents')
        .select('category', { count: 'exact', head: true });

      const { data: institutionCount } = await req.supabase
        .from('wee_institutions')
        .select('type', { count: 'exact', head: true });

      const { data: announcementCount } = await req.supabase
        .from('wee_announcements')
        .select('*', { count: 'exact', head: true });

      const { data: recentScrapes } = await req.supabase
        .from('wee_contents')
        .select('scraped_at, category')
        .order('scraped_at', { ascending: false })
        .limit(5);

      res.json({
        success: true,
        stats: {
          totalContents: contentCount || 0,
          totalInstitutions: institutionCount || 0,
          totalAnnouncements: announcementCount || 0,
          recentScrapes: recentScrapes || []
        }
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics'
      });
    }
  }
);

// Get scraped content by category
router.get('/content/:category',
  async (req, res) => {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const offset = (Number(page) - 1) * Number(limit);

      const { data, error, count } = await req.supabase
        .from('wee_contents')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('scraped_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) throw error;

      res.json({
        success: true,
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error) {
      console.error('Content fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch content'
      });
    }
  }
);

// Get institutions
router.get('/institutions',
  async (req, res) => {
    try {
      const { type, region } = req.query;
      
      let query = req.supabase
        .from('wee_institutions')
        .select('*')
        .order('name');

      if (type) {
        query = query.eq('type', type);
      }
      
      if (region) {
        query = query.eq('region', region);
      }

      const { data, error } = await query;

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Institutions fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch institutions'
      });
    }
  }
);

export default router;