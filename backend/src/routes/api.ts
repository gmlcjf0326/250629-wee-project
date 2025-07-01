import { Router } from 'express';
import authRoutes from './auth.routes';
import infoRoutes from './info.routes';
import contactRoutes from './contact.routes';
import serviceRoutes from './service.routes';
import noticeRoutes from './notice.routes';
import resourceRoutes from './resource.routes';
import surveyRoutes from './survey.routes';
import uploadRoutes from './upload.routes';
import fileRoutes from './file.routes';
import statsRoutes from './stats.routes';
import scraperRoutes from './scraper.routes';
import communityRoutes from './community.routes';
import newsletterRoutes from './newsletter.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/info', infoRoutes);
router.use('/contact', contactRoutes);
router.use('/services', serviceRoutes);
router.use('/notices', noticeRoutes);
router.use('/resources', resourceRoutes);
router.use('/surveys', surveyRoutes);
router.use('/uploads', uploadRoutes);
router.use('/files', fileRoutes);
router.use('/stats', statsRoutes);
router.use('/scraper', scraperRoutes);
router.use('/community', communityRoutes);
router.use('/newsletters', newsletterRoutes);

// API root
router.get('/', (req, res) => {
  res.json({
    message: 'Wee Project API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      info: '/api/info',
      contact: '/api/contact',
      services: '/api/services',
      notices: '/api/notices',
      resources: '/api/resources',
      surveys: '/api/surveys',
      uploads: '/api/uploads',
      files: '/api/files',
      stats: '/api/stats',
      scraper: '/api/scraper',
      community: '/api/community',
      newsletters: '/api/newsletters'
    }
  });
});

export default router;