import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ColumnCard from '../components/ColumnCard';
import { supabase } from '../supabase/client';
import { useCachedData } from '../hooks/useCachedData';
import '../components/PostList.css';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Column {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 10;

  // 使用缓存获取专栏数据（一次性加载）
  const { 
    data: cachedColumns, 
    error: columnsError 
  } = useCachedData<Column[]>(
    'homepage_columns',
    async () => {
      const { data, error } = await supabase
        .from('columns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    [],
    60 * 60 * 1000 // 1小时缓存
  );

  useEffect(() => {
    if (cachedColumns) {
      setColumns(cachedColumns);
    }
    if (columnsError) {
      setError(columnsError);
    }
  }, [cachedColumns, columnsError]);

  // 使用缓存获取第一页文章数据
  const { 
    data: cachedPosts, 
    loading: postsLoading, 
    error: postsError 
  } = useCachedData<Post[]>(
    'homepage_posts_page_1',
    async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .is('column_id', null) // 只获取未投专栏的文章
        .order('created_at', { ascending: false })
        .range(0, postsPerPage - 1);

      if (error) throw error;
      return data || [];
    },
    [],
    5 * 60 * 1000 // 5分钟缓存
  );

  // 获取后续页面文章数据（无缓存）
  useEffect(() => {
    if (page > 1) {
      const fetchMorePosts = async () => {
        try {
          setLoadingMore(true);

          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('is_published', true)
            .is('column_id', null)
            .order('created_at', { ascending: false })
            .range((page - 1) * postsPerPage, page * postsPerPage - 1);

          if (error) throw error;

          setPosts(prevPosts => [...prevPosts, ...(data || [])]);
          setHasMore((data || []).length === postsPerPage);
        } catch (err) {
          setError('获取更多数据失败');
          console.error('Error fetching more posts:', err);
        } finally {
          setLoadingMore(false);
        }
      };

      fetchMorePosts();
    }
  }, [page]);

  // 处理第一页缓存数据
  useEffect(() => {
    if (cachedPosts) {
      setPosts(cachedPosts);
      setHasMore(cachedPosts.length === postsPerPage);
    }
    if (postsError) {
      setError(postsError);
    }
  }, [cachedPosts, postsError]);

  // 合并加载状态
  useEffect(() => {
    setLoading(postsLoading && page === 1);
  }, [postsLoading, page]);

  // 加载更多文章
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="page-title"></h1>
        
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (columns.length === 0 && posts.length === 0) ? (
          <div className="empty-state">暂无内容</div>
        ) : (
          <div className="post-list">
            {/* 专栏卡片 */}
            {columns.length > 0 && (
              columns.map((column) => (
                <ColumnCard key={column.id} column={column} />
              ))
            )}
            
            {/* 文章列表 */}
            {posts.length > 0 && (
              posts.map((post) => (
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
              ))
            )}
            
            {/* 加载更多按钮 */}
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? '加载中...' : '加载更多'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
