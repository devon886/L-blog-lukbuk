import React from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = React.memo(({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <div className="post-header">
            <Link to={`/posts/${post.id}`} className="post-link">
              <h2 className="post-title">{post.title}</h2>
            </Link>
            <div className="post-meta">
              <time className="post-date">
                {new Date(post.created_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric'
                }).replace(/\./g, '/')}
              </time>
            </div>
          </div>
          <p className="post-excerpt">
            {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
          </p>
        </div>
      ))}
    </div>
  );
});

export default PostList;
