import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import CommentForm from './CommentForm';
import './CommentItem.css';

interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  content: string;
  author_name: string;
  author_email: string;
  created_at: string;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply: (commentId: string, content: string, authorName: string, authorEmail: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment,
  postId,
  onReply 
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  const handleSubmitReply = (content: string, authorName: string, authorEmail: string, _postId?: string, parentId?: string) => {
    const targetCommentId = parentId || comment.id;
    onReply(targetCommentId, content, authorName, authorEmail);
    setShowReplyForm(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getAvatar = (name: string) => {
    const seed = name.replace(/\s+/g, '');
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <img 
          src={getAvatar(comment.author_name)} 
          alt={comment.author_name}
          className="comment-avatar"
        />
        <div className="comment-meta">
          <span className="comment-author">{comment.author_name}</span>
          <span className="comment-date">{formatTime(comment.created_at)}</span>
        </div>
      </div>
      <div 
        className="comment-content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }}
      />
      <div className="comment-actions">
        <button 
          className="reply-button"
          onClick={handleReply}
        >
          回复
        </button>
      </div>
      {showReplyForm && (
        <CommentForm
          postId={postId}
          parentId={comment.id}
          onSubmit={handleSubmitReply}
          onCancel={handleCancelReply}
          isReply
        />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
