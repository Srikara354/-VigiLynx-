import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Image as ImageIcon,
  Link as LinkIcon,
  Hash,
  X,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  hashtags?: string[];
}

export const CommunityPosts = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Security Analyst',
      },
      content:
        'Just discovered a new phishing campaign targeting financial institutions. Stay vigilant and report any suspicious emails!',
      timestamp: '2 hours ago',
      likes: 45,
      comments: 12,
      shares: 8,
      hashtags: ['CyberSecurity', 'PhishingAwareness'],
    },
    {
      id: 2,
      author: {
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'Network Engineer',
      },
      content:
        'Sharing some best practices for securing your home network. Remember to regularly update your router firmware and use strong passwords!',
      timestamp: '5 hours ago',
      likes: 32,
      comments: 7,
      shares: 15,
      hashtags: ['NetworkSecurity', 'HomeSecurity'],
    },
    {
      id: 3,
      author: {
        name: 'Emily Rodriguez',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'Security Researcher',
      },
      content:
        'New research paper on emerging threats in IoT devices. The findings are concerning but provide valuable insights for security professionals.',
      timestamp: '1 day ago',
      likes: 78,
      comments: 23,
      shares: 34,
      hashtags: ['IoT', 'SecurityResearch'],
    },
  ]);

  const [newPost, setNewPost] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [currentHashtag, setCurrentHashtag] = useState('');

  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const handleShare = (postId: number) => {
    // Implement share functionality
    console.log('Sharing post:', postId);
  };

  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentHashtag.trim()) {
      e.preventDefault();
      const tag = currentHashtag.trim().replace(/^#/, '');
      if (!hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setCurrentHashtag('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const newPostObj: Post = {
      id: posts.length + 1,
      author: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=4',
        role: 'Community Member',
      },
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      hashtags: hashtags,
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setHashtags([]);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Create Post */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-800">
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src="https://i.pravatar.cc/150?img=4"
                alt="Your avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts with the community..."
                  className="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-dark-600 dark:bg-dark-700 dark:text-white dark:placeholder-gray-400"
                  rows={3}
                />
                <div className="mt-3 space-y-3">
                  {/* Hashtags Input */}
                  <div className="flex flex-wrap items-center gap-2">
                    {hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeHashtag(tag)}
                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={currentHashtag}
                        onChange={(e) => setCurrentHashtag(e.target.value)}
                        onKeyPress={handleHashtagKeyPress}
                        placeholder="Add hashtags..."
                        className="ml-1 border-none bg-transparent p-1 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700"
                      >
                        <LinkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {post.author.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.author.role} • {post.timestamp}
                      </p>
                    </div>
                  </div>
                  <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-4 text-gray-700 dark:text-gray-300">{post.content}</p>

                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-600">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        post.isLiked
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700'
                      }`}
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700">
                      <MessageSquare className="h-5 w-5" />
                      <span>{post.comments}</span>
                    </button>
                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`rounded-lg p-2 transition-colors ${
                      post.isBookmarked
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700'
                    }`}
                  >
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}; 