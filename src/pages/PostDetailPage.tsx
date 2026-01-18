import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PostDetail from '../components/PostDetail';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { CONFIG } from '../config';
import { useCachedData } from '../hooks/useCachedData';

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

  // 使用缓存获取文章详情
  const { 
    data: cachedPost, 
    loading: postLoading, 
    error: postError
  } = useCachedData<Post>(
    `post_detail_${id}`,
    async () => {
      if (!id) {
        throw new Error('文章ID无效');
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('文章不存在');
      
      return data;
    },
    [id],
    24 * 60 * 60 * 1000 // 24小时缓存
  );

  // 处理缓存数据
  useEffect(() => {
    if (id) {
      setLoading(postLoading);
      setError(postError || null);

      if (cachedPost) {
        setPost(cachedPost);
      }
    } else {
      setError('文章ID无效');
      setLoading(false);
    }
  }, [id, cachedPost, postLoading, postError]);

  // 清除缓存函数
  const clearCache = () => {
    // 清除当前文章的缓存
    localStorage.removeItem(`post_detail_${id}`);
    // 清除首页的缓存，确保首页能显示最新内容
    localStorage.removeItem('homepage_posts_page_1');
    // 如果文章在某个专栏中，也应该清除对应专栏的缓存
    // 由于我们不知道文章属于哪个专栏，这里不做处理
  };

  const handleDelete = async () => {
    if (!post || !window.confirm('确定要删除这篇文章吗？')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      
      // 清除相关缓存
      clearCache();
      
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
              onEdit={CONFIG.ADMIN_ENABLED && user ? handleEdit : undefined} 
              onDelete={CONFIG.ADMIN_ENABLED && user ? handleDelete : undefined} 
              isAuthor={CONFIG.ADMIN_ENABLED && !!user} 
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
