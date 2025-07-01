import { Request, Response, NextFunction } from 'express';
import communityService from '../services/community.service';
import { asyncHandler } from '../utils/asyncHandler';

// Get all posts
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    category: req.query.category as string,
    search: req.query.search as string,
    sort: req.query.sort as 'latest' | 'popular' | 'comments',
    author_id: req.query.author_id as string
  };

  const result = await communityService.getPosts(query);

  res.json({
    success: true,
    data: result
  });
});

// Get single post
export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await communityService.getPostById(id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  res.json({
    success: true,
    data: post
  });
});

// Create post
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { title, content, category, author_name } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }

  const post = await communityService.createPost(
    { title, content, category, author_name },
    req.user.id
  );

  res.status(201).json({
    success: true,
    data: post
  });
});

// Update post
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { id } = req.params;
  const { title, content, category, author_name } = req.body;

  const post = await communityService.updatePost(
    id,
    { title, content, category, author_name },
    req.user.id
  );

  res.json({
    success: true,
    data: post
  });
});

// Delete post
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { id } = req.params;
  await communityService.deletePost(id, req.user.id);

  res.json({
    success: true,
    message: 'Post deleted successfully'
  });
});

// Like/unlike post
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { id } = req.params;
  const result = await communityService.likePost(id, req.user.id);

  res.json({
    success: true,
    data: result
  });
});

// Get comments for a post
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const comments = await communityService.getComments(postId);

  res.json({
    success: true,
    data: comments
  });
});

// Create comment
export const createComment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { postId } = req.params;
  const { content, parent_id, author_name } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: 'Content is required'
    });
  }

  const comment = await communityService.createComment(
    { post_id: postId, content, parent_id, author_name },
    req.user.id
  );

  res.status(201).json({
    success: true,
    data: comment
  });
});

// Update comment
export const updateComment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: 'Content is required'
    });
  }

  const comment = await communityService.updateComment(id, content, req.user.id);

  res.json({
    success: true,
    data: comment
  });
});

// Delete comment
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { id } = req.params;
  await communityService.deleteComment(id, req.user.id);

  res.json({
    success: true,
    message: 'Comment deleted successfully'
  });
});

// Get user stats
export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const userId = req.params.userId || req.user.id;
  const stats = await communityService.getUserStats(userId);

  res.json({
    success: true,
    data: stats
  });
});