import React from 'react';
import './PostDetail.css';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface PostDetailProps {
  post: Post;
  onEdit?: () => void;
  onDelete?: () => void;
  isAuthor?: boolean;
}

const PostDetail: React.FC<PostDetailProps> = React.memo(({ post, onEdit, onDelete, isAuthor = false }) => {
  return (
    <div className="post-detail">
      <article className="post-content">
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
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
        <div className="post-body">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="post-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
        
        {isAuthor && (onEdit || onDelete) && (
          <div className="post-actions">
            {onEdit && (
              <button className="action-button edit-button" onClick={onEdit}>
                编辑
              </button>
            )}
            {onDelete && (
              <button className="action-button delete-button" onClick={onDelete}>
                删除
              </button>
            )}
          </div>
        )}
      </article>
    </div>
  );
});

export default PostDetail;
