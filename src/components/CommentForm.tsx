import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import './CommentForm.css';

interface CommentFormProps {
  postId?: string;
  parentId?: string;
  onSubmit: (content: string, authorName: string, authorEmail: string, postId?: string, parentId?: string) => void;
  isReply?: boolean;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  postId,
  parentId,
  onSubmit, 
  isReply = false,
  onCancel
}) => {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('请输入评论内容');
      return;
    }
    
    if (!authorName.trim()) {
      alert('请输入昵称');
      return;
    }
    
    if (!authorEmail.trim()) {
      alert('请输入邮箱');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      alert('请输入有效的邮箱地址');
      return;
    }

    if (content.length > 1000) {
      alert('评论内容不能超过 1000 字');
      return;
    }

    setIsSubmitting(true);
    const sanitizedContent = DOMPurify.sanitize(content.trim());
    onSubmit(sanitizedContent, authorName.trim(), authorEmail.trim(), postId, parentId);
    setContent('');
    setIsSubmitting(false);
  };

  return (
    <form className={`comment-form ${isReply ? 'reply-form' : ''}`} onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          className="form-input"
          placeholder="昵称"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
          maxLength={50}
        />
        <input
          type="email"
          className="form-input"
          placeholder="邮箱"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          required
          maxLength={100}
        />
      </div>
      <textarea
        className="form-textarea"
        placeholder={isReply ? "回复评论..." : "发表评论..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        maxLength={1000}
      />
      <div className="form-actions">
        {isReply && onCancel && (
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            取消
          </button>
        )}
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '提交中...' : (isReply ? '回复' : '发表评论')}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
