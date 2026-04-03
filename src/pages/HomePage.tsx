import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useCachedData } from '../hooks/useCachedData';
import '../components/PostList.css';
import './HomePage.css';

const extractPlainText = (htmlContent: string): string => {
  if (!htmlContent) return '';
  
  try {
    const cleanHtml = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
    const isFullHtml = cleanHtml.trim().startsWith('<!DOCTYPE html') || cleanHtml.trim().startsWith('<html');
    
    let contentToParse = cleanHtml;
    
    if (isFullHtml) {
      const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        contentToParse = bodyMatch[1];
      }
    }
    
    const pTags = contentToParse.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (pTags && pTags.length > 0) {
      const allPTagContent = pTags.map(tag => {
        return tag.replace(/<p[^>]*>/i, '').replace(/<\/p>/i, '');
      }).join(' ');
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = allPTagContent;
      const plainText = tempDiv.textContent?.trim() || '';
      
      return plainText;
    } else {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentToParse;
      const plainText = tempDiv.textContent?.trim() || '';
      return plainText;
    }
  } catch {
    console.error('Error extracting plain text from p tags');
    try {
      const cleanHtml = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
      const pTags = cleanHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
      if (pTags && pTags.length > 0) {
        return pTags.map(tag => tag.replace(/<[^>]*>/g, '')).join(' ').trim();
      } else {
        return cleanHtml.replace(/<[^>]*>/g, '').trim();
      }
    } catch {
      return '';
    }
  }
};

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 10;

  const getRunningTime = () => {
    const startDate = new Date('2026-02-14');
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
  };

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
        .order('created_at', { ascending: false })
        .range(0, postsPerPage - 1);

      if (error) throw error;
      return data || [];
    },
    [],
    5 * 60 * 1000
  );

  useEffect(() => {
    if (page > 1) {
      const fetchMorePosts = async () => {
        try {
          setLoadingMore(true);

          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('is_published', true)
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

  useEffect(() => {
    if (cachedPosts) {
      setPosts(cachedPosts);
      setHasMore(cachedPosts.length === postsPerPage);
    }
    if (postsError) {
      setError(postsError);
    }
  }, [cachedPosts, postsError]);

  useEffect(() => {
    setLoading(postsLoading && page === 1);
  }, [postsLoading, page]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="home-page">
      <div className="home-layout">
        <aside className="sidebar">
          <div className="sidebar-content">
            <div className="profile-section">
              <div className="profile-avatar">L</div>
              <h2 className="profile-name">Lukbuk</h2>
            </div>
            
            <div className="sidebar-section">
              <p className="intro-text">
                这里是我分享技术文章、学习心得和生活感悟的地方。
              </p>
            </div>
            
            <div className="sidebar-section stats-section">
              <div className="stat-item">
                <span className="stat-label">创立时间</span>
                <span className="stat-value">2026/2/14</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">已运行</span>
                <span className="stat-value">{getRunningTime()} 天</span>
              </div>
            </div>
            
            <div className="sidebar-section contact-section">
              <div className="stat-item">
                <span className="stat-label">联系方式</span>
                <a href="mailto:lukbuk@qq.com" className="contact-email">lukbuk@qq.com</a>
              </div>
            </div>
            
            <div className="sidebar-section social-section">
              <div className="social-links">
                <a 
                  href="https://github.com/devon886" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  title="GitHub"
                >
                  <svg viewBox="0 0 24 24" className="social-icon">
                    <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </a>
                <a 
                  href="https://x.com/de_v_o_n" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  title="X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" className="social-icon">
                    <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </a>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="main-content">
          {loading ? (
            <div className="loading">加载中...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">暂无内容</div>
          ) : (
            <div className="post-list">
              {posts.map((item) => (
                <div key={item.id} className="post-item">
                  <div className="post-header">
                    <Link to={`/posts/${item.slug}`} className="post-link">
                      <h2 className="post-title">
                        {item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title}
                      </h2>
                    </Link>
                    <div className="post-meta">
                      <time className="post-date">
                        {new Date(item.created_at).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric'
                        }).replace(/\./g, '/')}
                      </time>
                    </div>
                  </div>
                  <p className="post-excerpt">
                    {(() => {
                      const plainText = extractPlainText(item.content);
                      return plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText;
                    })()}
                  </p>
                </div>
              ))}
              
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
        </main>
      </div>
    </div>
  );
};

export default HomePage;
