import { Router } from 'express';
import * as communityController from '../controllers/community.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { postLimiter } from '../middleware/rateLimiter';
import { validateCreatePost, validateCreateComment, validateUUID, validatePagination } from '../middleware/validation';

const router = Router();

// Public routes (with optional auth for personalization)
router.get('/posts', optionalAuth, ...validatePagination, communityController.getPosts);
router.get('/posts/:id', optionalAuth, ...validateUUID('id'), communityController.getPost);
router.get('/posts/:postId/comments', ...validateUUID('postId'), communityController.getComments);

// Protected routes
router.post('/posts', authenticate, postLimiter, ...validateCreatePost, communityController.createPost);
router.put('/posts/:id', authenticate, ...validateUUID('id'), ...validateCreatePost, communityController.updatePost);
router.delete('/posts/:id', authenticate, ...validateUUID('id'), communityController.deletePost);
router.post('/posts/:id/like', authenticate, ...validateUUID('id'), communityController.likePost);

router.post('/posts/:postId/comments', authenticate, ...validateUUID('postId'), ...validateCreateComment, communityController.createComment);
router.put('/comments/:id', authenticate, ...validateUUID('id'), ...validateCreateComment, communityController.updateComment);
router.delete('/comments/:id', authenticate, ...validateUUID('id'), communityController.deleteComment);

router.get('/users/:userId/stats', optionalAuth, ...validateUUID('userId'), communityController.getUserStats);

export default router;