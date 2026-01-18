import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PostDetail from '../components/PostDetail';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) {
      setError('文章ID无效');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('文章不存在');
        
        setPost(data);
      } catch (err) {
        setError('获取文章失败');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !window.confirm('确定要删除这篇文章吗？')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      navigate('/');
    } catch (err) {
      alert('删除文章失败');
      console.error('Error deleting post:', err);
    }
  };

  const handleEdit = () => {
    if (post) {
      navigate(`/write?edit=${post.id}`);
    }
  };

  return (
    <div className="post-detail-page">
      <div className="container">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : post ? (
          <>
            <div className="back-link">
              <Link to="/">← 返回</Link>
            </div>
            <PostDetail 
              post={post} 
              onEdit={user ? handleEdit : undefined} 
              onDelete={user ? handleDelete : undefined} 
              isAuthor={!!user} 
            />
          </>
        ) : (
          <div className="error">文章不存在</div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
