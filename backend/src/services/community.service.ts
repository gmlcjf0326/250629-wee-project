import { supabaseAdmin } from '../config/supabase';

export interface CommunityPost {
  id?: string;
  title: string;
  content: string;
  author_id?: string;
  author_name?: string;
  category?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  is_notice?: boolean;
  is_pinned?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommunityComment {
  id?: string;
  post_id: string;
  parent_id?: string;
  author_id?: string;
  author_name?: string;
  content: string;
  like_count?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PostQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'comments';
  author_id?: string;
}

class CommunityService {
  async getPosts(query: PostQuery = {}) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const {
      page = 1,
      limit = 10,
      category,
      search,
      sort = 'latest',
      author_id
    } = query;

    const offset = (page - 1) * limit;

    let queryBuilder = supabaseAdmin
      .from('community_posts')
      .select('*, author:users!author_id(id, email, full_name)', { count: 'exact' })
      .eq('status', 'active')
      .range(offset, offset + limit - 1);

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    if (author_id) {
      queryBuilder = queryBuilder.eq('author_id', author_id);
    }

    if (search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    switch (sort) {
      case 'popular':
        queryBuilder = queryBuilder.order('view_count', { ascending: false });
        break;
      case 'comments':
        queryBuilder = queryBuilder.order('comment_count', { ascending: false });
        break;
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw error;
    }

    return {
      posts: data || [],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    };
  }

  async getPostById(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .select('*, author:users!author_id(id, email, full_name)')
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      throw error;
    }

    // Increment view count
    await supabaseAdmin
      .from('community_posts')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return data;
  }

  async createPost(post: CommunityPost, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // If author_name is not provided, get user info
    let authorName = post.author_name;
    if (!authorName) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('full_name, email')
        .eq('id', userId)
        .single();
      
      authorName = user?.full_name || user?.email || 'Anonymous';
    }

    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .insert({
        ...post,
        author_id: userId,
        author_name: authorName
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updatePost(id: string, post: Partial<CommunityPost>, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Check ownership
    const { data: existingPost } = await supabaseAdmin
      .from('community_posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (!existingPost || existingPost.author_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .update({
        title: post.title,
        content: post.content,
        category: post.category,
        author_name: post.author_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deletePost(id: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Check ownership
    const { data: existingPost } = await supabaseAdmin
      .from('community_posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (!existingPost || existingPost.author_id !== userId) {
      throw new Error('Unauthorized');
    }

    // Soft delete
    const { error } = await supabaseAdmin
      .from('community_posts')
      .update({ status: 'deleted' })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  async likePost(postId: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Check if already liked
    const { data: existingLike } = await supabaseAdmin
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      await supabaseAdmin
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);

      // Decrement like count
      const { data: post } = await supabaseAdmin
        .from('community_posts')
        .select('like_count')
        .eq('id', postId)
        .single();
      
      await supabaseAdmin
        .from('community_posts')
        .update({ 
          like_count: Math.max(0, (post?.like_count || 1) - 1)
        })
        .eq('id', postId);

      return { liked: false };
    } else {
      // Like
      await supabaseAdmin
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });

      // Increment like count
      const { data: post } = await supabaseAdmin
        .from('community_posts')
        .select('like_count')
        .eq('id', postId)
        .single();
      
      await supabaseAdmin
        .from('community_posts')
        .update({ 
          like_count: (post?.like_count || 0) + 1
        })
        .eq('id', postId);

      return { liked: true };
    }
  }

  async getComments(postId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('community_comments')
      .select('*, author:users!author_id(id, email, full_name)')
      .eq('post_id', postId)
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async createComment(comment: CommunityComment, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // If author_name is not provided, get user info
    let authorName = comment.author_name;
    if (!authorName) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('full_name, email')
        .eq('id', userId)
        .single();
      
      authorName = user?.full_name || user?.email || 'Anonymous';
    }

    const { data, error } = await supabaseAdmin
      .from('community_comments')
      .insert({
        ...comment,
        author_id: userId,
        author_name: authorName
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateComment(id: string, content: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Check ownership
    const { data: existingComment } = await supabaseAdmin
      .from('community_comments')
      .select('author_id')
      .eq('id', id)
      .single();

    if (!existingComment || existingComment.author_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabaseAdmin
      .from('community_comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteComment(id: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // Check ownership
    const { data: existingComment } = await supabaseAdmin
      .from('community_comments')
      .select('author_id')
      .eq('id', id)
      .single();

    if (!existingComment || existingComment.author_id !== userId) {
      throw new Error('Unauthorized');
    }

    // Soft delete
    const { error } = await supabaseAdmin
      .from('community_comments')
      .update({ status: 'deleted' })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  async getUserStats(userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { count: postCount } = await supabaseAdmin
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'active');

    const { count: commentCount } = await supabaseAdmin
      .from('community_comments')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'active');

    const { data: likedPosts } = await supabaseAdmin
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);

    return {
      postCount: postCount || 0,
      commentCount: commentCount || 0,
      likedPosts: likedPosts?.map(l => l.post_id) || []
    };
  }
}

export default new CommunityService();