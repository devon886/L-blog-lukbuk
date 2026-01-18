import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ColumnCard from '../components/ColumnCard';
import { supabase } from '../supabase/client';
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

  // 获取专栏数据（一次性加载）
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const { data, error } = await supabase
          .from('columns')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setColumns(data || []);
      } catch (err) {
        console.error('Error fetching columns:', err);
      }
    };

    fetchColumns();
  }, []);

  // 获取文章数据（分页加载）
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .is('column_id', null) // 只获取未投专栏的文章
          .order('created_at', { ascending: false })
          .range((page - 1) * postsPerPage, page * postsPerPage - 1);

        if (error) throw error;

        if (page === 1) {
          setPosts(data || []);
        } else {
          setPosts(prevPosts => [...prevPosts, ...(data || [])]);
        }

        // 检查是否还有更多数据
        setHasMore((data || []).length === postsPerPage);
      } catch (err) {
        setError('获取数据失败');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchPosts();
  }, [page]);

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
                          month: 'long',
                          day: 'numeric'
                        })}
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
