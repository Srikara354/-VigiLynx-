export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  content: string;
  likes: number;
  created_at: string;
}

export interface PostLike {
  post_id: string;
  user_id: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
}

export interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  likedPosts: Set<string>;
  overviewPostId: string | null;
  overviewContent: string;
  overviewLoading: boolean;
} 