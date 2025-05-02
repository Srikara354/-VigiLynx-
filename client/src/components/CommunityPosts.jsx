import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle, X, Filter, Send, Trash2, Share } from 'lucide-react';
import { supabase } from '../../supabase';
import { sanitizeContent } from '../lib/utils';
import AlertMessage from './ui/AlertMessage';

function CommunityPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const postsPerPage = 10;

  const fetchPosts = useCallback(async (resetPosts = false) => {
    const currentPage = resetPosts ? 0 : page;
    setLoading(true);
    
    try {
      // Get user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }

      // Get posts with pagination - Using community_posts table as defined in usePosts.ts
      let query = supabase.from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(currentPage * postsPerPage, (currentPage + 1) * postsPerPage - 1);
      
      if (filter !== 'all') {
        query = query.eq('category', filter);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;

      console.log("Fetched posts:", data); // Debugging

      // Update pagination state
      setHasMore(data?.length === postsPerPage);
      
      // Update posts state
      setPosts(prev => resetPosts ? data || [] : [...prev, ...(data || [])]);

      if (resetPosts) {
        setPage(0);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load community posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filter, page, postsPerPage]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(true);
  }, [filter]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    if (!newPostTitle.trim() || !newPost.trim()) {
      setError('Please provide both a title and content for your post.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You must be logged in to post.');
        return;
      }
      
      console.log("Current user session:", session.user);
      
      // Simplified post data to match exact schema from types/community.ts
      const newPostData = { 
        title: newPostTitle,
        content: newPost,
        user_id: session.user.id,
        user_name: session.user.email,
        likes: 0
        // Note: created_at is handled automatically by Supabase
      };
      
      console.log("Preparing to insert post:", newPostData);
      
      // Optimistic update
      const optimisticPost = {
        ...newPostData,
        id: `temp-${Date.now()}`, // Temporary ID
        created_at: new Date().toISOString(),
        isOptimistic: true
      };
      
      setPosts(prevPosts => [optimisticPost, ...prevPosts]);
      
      // First, ensure we have the right table
      console.log("Database tables check");
      const { data: tables } = await supabase.from('_metadata').select('*');
      console.log("Tables:", tables);
      
      // Using community_posts table
      const { data, error } = await supabase.from('community_posts').insert([newPostData]);
      
      if (error) {
        console.error("Supabase insert error details:", error);
        throw error;
      }
      
      console.log("Successfully created post, refreshing list...");
      
      // Refresh the posts list to get the newly created post
      fetchPosts(true);
      
      setNewPostTitle('');
      setNewPost('');
    } catch (err) {
      console.error('Error submitting post:', err);
      setError(`Failed to submit your post: ${err.message || 'Unknown error'}`);
      
      // Remove optimistic post on error
      setPosts(prevPosts => prevPosts.filter(post => !post.isOptimistic));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Optimistic update
      const postToDelete = posts.find(p => p.id === postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      // Using community_posts table
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);
      
      if (error) {
        // Restore post on error
        setPosts(prevPosts => [postToDelete, ...prevPosts]);
        throw error;
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      const post = posts.find(p => p.id === postId);
      
      if (!post) return;
      
      // Optimistic update
      setPosts(prevPosts => 
        prevPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p, 
              [voteType === 'like' ? 'likes' : 'dislikes']: p[voteType === 'like' ? 'likes' : 'dislikes'] + 1
            };
          }
          return p;
        })
      );
      
      // Using community_posts table
      const { error } = await supabase
        .from('community_posts')
        .update({ 
          [voteType === 'like' ? 'likes' : 'dislikes']: voteType === 'like' ? post.likes + 1 : post.dislikes + 1 
        })
        .eq('id', postId);
      
      if (error) {
        // Revert on error
        setPosts(prevPosts => 
          prevPosts.map(p => p.id === postId ? post : p)
        );
        throw error;
      }
    } catch (err) {
      console.error('Error updating votes:', err);
      setError('Failed to record vote. Please try again.');
    }
  };

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1);
    fetchPosts();
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  // Category options
  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'help', label: 'Help & Support' },
    { id: 'news', label: 'News & Updates' },
  ];

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4">
      <div className="mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2 flex items-center"
        >
          <MessageSquare className="mr-2 text-primary" size={24} /> 
          Community Discussion
        </motion.h2>
        <p className="text-muted-foreground">
          Connect with other users, share experiences, and discuss cybersecurity topics.
        </p>
      </div>

      {error && (
        <AlertMessage
          variant="error"
          message={error}
          onDismiss={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading && posts.length === 0 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-border">
                  <div className="h-32 bg-secondary animate-pulse"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-6 bg-secondary rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-secondary rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-secondary rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-secondary rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-secondary/30 rounded-lg border border-border">
              <MessageSquare size={40} className="mx-auto text-muted-foreground mb-2 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No posts found</h3>
              <p className="text-muted-foreground">
                Be the first to start a discussion!
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false} mode="popLayout">
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div 
                    key={post.id} 
                    variants={postVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                    className={`card hover:border-primary/30 transition-all-normal ${post.isOptimistic ? 'opacity-70' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium mb-1">{sanitizeContent(post.title)}</h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Posted by {post.user_name || "Anonymous"}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{post.category}</span>
                        </div>
                      </div>
                      {currentUser && currentUser.id === post.user_id && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 hover:bg-danger/10 hover:text-danger rounded-full transition-all-normal"
                          aria-label="Delete post"
                          disabled={post.isOptimistic}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-6 text-pretty whitespace-pre-line">
                      {sanitizeContent(post.content)}
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <button 
                        onClick={() => handleVote(post.id, 'like')}
                        className="flex items-center gap-1 text-sm hover:text-primary transition-all-normal"
                        disabled={post.isOptimistic}
                      >
                        <ThumbsUp size={16} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleVote(post.id, 'dislike')}
                        className="flex items-center gap-1 text-sm hover:text-danger transition-all-normal"
                        disabled={post.isOptimistic}
                      >
                        <ThumbsDown size={16} />
                        <span>{post.dislikes}</span>
                      </button>
                      
                      <button 
                        className="flex items-center gap-1 text-sm hover:text-accent transition-all-normal ml-auto"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        aria-label="Copy link"
                      >
                        <Share size={16} />
                        <span>Share</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                {hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMorePosts}
                      className="btn btn-outline"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More Posts'}
                    </button>
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>

        <div>
          <div className="card mb-6">
            <h3 className="font-semibold mb-4">Create New Post</h3>
            
            <form onSubmit={handleSubmitPost}>
              <div className="form-group">
                <label htmlFor="post-title" className="form-label">Title</label>
                <input
                  id="post-title"
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Post title"
                  className="input"
                  required
                  disabled={!currentUser || isSubmitting}
                  maxLength={100}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-muted-foreground">
                    {newPostTitle.length}/100
                  </span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="post-content" className="form-label">Content</label>
                <textarea
                  id="post-content"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="input min-h-[120px]"
                  required
                  disabled={!currentUser || isSubmitting}
                  maxLength={2000}
                ></textarea>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-muted-foreground">
                    {newPost.length}/2000
                  </span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !currentUser}
                className={`btn btn-primary w-full ${isSubmitting ? 'btn-loading' : ''}`}
              >
                {isSubmitting ? '' : (
                  <>
                    <Send size={16} className="mr-2" /> Create Post
                  </>
                )}
              </button>
              
              {!currentUser && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  You need to sign in to create posts
                </p>
              )}
            </form>
          </div>
          
          <div className="card bg-secondary/20">
            <h3 className="font-semibold mb-4">Community Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                </div>
                <span>Be respectful and constructive</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                </div>
                <span>No spam or promotional content</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                </div>
                <span>Don't share sensitive information</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                </div>
                <span>Stay on topic and help others</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPosts;