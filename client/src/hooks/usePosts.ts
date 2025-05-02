import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase';
import { PostState, CreatePostInput } from '../types/community';
import { sanitizeHtml } from '../utils/sanitize';

const POSTS_PER_PAGE = 10;

export const usePosts = (userId: string | null) => {
  const [state, setState] = useState<PostState>({
    posts: [],
    loading: true,
    error: null,
    likedPosts: new Set(),
    overviewPostId: null,
    overviewContent: '',
    overviewLoading: false,
  });

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (postsError) throw postsError;

      if (userId) {
        const { data: likesData, error: likesError } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId);

        if (likesError) throw likesError;
        const likedPostIds = new Set(likesData.map(like => like.post_id));
        setState(prev => ({ ...prev, likedPosts: likedPostIds }));
      }

      setState(prev => ({ ...prev, posts: postsData, loading: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load posts',
        loading: false,
      }));
      console.error('Fetch error:', err);
    }
  }, [userId]);

  const createPost = useCallback(async ({ title, content }: CreatePostInput) => {
    if (!userId) {
      setState(prev => ({ ...prev, error: 'Please sign in to post' }));
      return;
    }

    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedContent = sanitizeHtml(content);

    if (!sanitizedTitle.trim() || !sanitizedContent.trim()) {
      setState(prev => ({ ...prev, error: 'Title and content are required' }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          user_id: userId,
          title: sanitizedTitle,
          content: sanitizedContent,
          user_name: userId.slice(0, 8), // Fallback to user ID if no name
        }])
        .select();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        posts: [data[0], ...prev.posts],
        error: null,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create post',
      }));
      console.error(err);
    }
  }, [userId]);

  const handleLike = useCallback(async (postId: string) => {
    if (!userId) {
      setState(prev => ({ ...prev, error: 'Please sign in to like posts' }));
      return;
    }

    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = state.likedPosts.has(postId);
    const newLikes = isLiked ? post.likes - 1 : post.likes + 1;
    
    // Optimistic update
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(p =>
        p.id === postId ? { ...p, likes: newLikes } : p
      ),
      likedPosts: isLiked
        ? new Set([...prev.likedPosts].filter(id => id !== postId))
        : new Set([...prev.likedPosts, postId]),
    }));

    try {
      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);
      } else {
        await supabase
          .from('post_likes')
          .insert([{ user_id: userId, post_id: postId }]);
      }

      await supabase
        .from('community_posts')
        .update({ likes: newLikes })
        .eq('id', postId);
    } catch (err) {
      // Revert on failure
      setState(prev => ({
        ...prev,
        posts: prev.posts.map(p =>
          p.id === postId ? { ...p, likes: post.likes } : p
        ),
        likedPosts: new Set(state.likedPosts),
        error: 'Failed to update like',
      }));
      console.error('Like update error:', err);
    }
  }, [userId, state.posts, state.likedPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    ...state,
    createPost,
    handleLike,
    fetchPosts,
  };
};