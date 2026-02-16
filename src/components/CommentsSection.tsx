import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import './CommentsSection.css';

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

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    flatComments.forEach(comment => {
      if (comment.parent_id && comment.parent_id !== '') {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies!.push(commentMap.get(comment.id)!);
        }
      } else {
        rootComments.push(commentMap.get(comment.id)!);
      }
    });

    return rootComments;
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const fetchedComments = data || [];
      setAllComments(fetchedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载评论失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (
    content: string, 
    authorName: string, 
    authorEmail: string,
    parentId?: string
  ) => {
    const now = Date.now();
    const timeSinceLastSubmit = (now - lastSubmitTime) / 1000;

    if (timeSinceLastSubmit < 60) {
      alert('提交太快了，请 1 分钟后再试');
      return;
    }

    if (submitCount >= 3 && timeSinceLastSubmit < 60) {
      alert('1 分钟内最多只能提交 3 条评论');
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          parent_id: parentId,
          content,
          author_name: authorName,
          author_email: authorEmail
        }]);

      if (error) {
        alert('发表评论失败，请重试');
        return;
      }

      setSubmitCount(prev => prev + 1);
      setLastSubmitTime(now);

      await fetchComments();

      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('发表评论失败，请重试');
    }
  };

  const handleReply = async (commentId: string, content: string, authorName: string, authorEmail: string) => {
    await handleSubmitComment(content, authorName, authorEmail, commentId);
  };

  const handleReset = () => {
    setSubmitCount(0);
    setLastSubmitTime(0);
    fetchComments();
  };

  useEffect(() => {
    setSubmitCount(0);
    setLastSubmitTime(0);
    fetchComments();
  }, [postId]);

  const nestedComments = buildCommentTree(allComments);

  if (loading) {
    return <div className="comments-loading">加载评论中...</div>;
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>评论 ({nestedComments.length})</h3>
        {submitCount > 0 && (
          <button className="reset-button" onClick={handleReset}>
            刷新
          </button>
        )}
      </div>

      <CommentForm
        postId={postId}
        onSubmit={handleSubmitComment}
      />

      {error && (
        <div className="comments-error">
          加载评论失败，请刷新重试
        </div>
      )}

      {nestedComments.length === 0 && !loading ? (
        <div className="no-comments">
          暂无评论，快来抢沙发吧！
        </div>
      ) : (
        <div className="comments-list">
          {nestedComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReply={handleReply}
            />
          ))}
          <div ref={commentsEndRef} />
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
