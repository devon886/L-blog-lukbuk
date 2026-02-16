import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ColumnCard from '../components/ColumnCard';
import { supabase } from '../supabase/client';
import { useCachedData } from '../hooks/useCachedData';
import '../components/PostList.css';

// 从HTML的<p>标签中提取纯文本，过滤掉注释
const extractPlainText = (htmlContent: string): string => {
  if (!htmlContent) return '';
  
  try {
    // 首先去除所有HTML注释
    const cleanHtml = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
    
    // 检查是否是完整的HTML文档
    const isFullHtml = cleanHtml.trim().startsWith('<!DOCTYPE html') || cleanHtml.trim().startsWith('<html');
    
    let contentToParse = cleanHtml;
    
    if (isFullHtml) {
      // 先提取body标签内的内容
      const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        contentToParse = bodyMatch[1];
      }
    }
    
    // 提取所有<p>标签内的内容
    const pTags = contentToParse.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (pTags && pTags.length > 0) {
      // 合并所有<p>标签的内容
      const allPTagContent = pTags.map(tag => {
        // 去除<p>标签，只保留内容
        return tag.replace(/<p[^>]*>/i, '').replace(/<\/p>/i, '');
      }).join(' ');
      
      // 创建临时元素解析HTML实体
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = allPTagContent;
      const plainText = tempDiv.textContent?.trim() || '';
      
      return plainText;
    } else {
      // 如果没有<p>标签，使用原来的方法提取纯文本
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentToParse;
      const plainText = tempDiv.textContent?.trim() || '';
      return plainText;
    }
  } catch (error) {
    // 如果出现错误，使用简单的正则表达式方法
    console.error('Error extracting plain text from p tags:', error);
    try {
      // 先去除注释
      const cleanHtml = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
      // 提取所有<p>标签内容
      const pTags = cleanHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
      if (pTags && pTags.length > 0) {
        return pTags.map(tag => tag.replace(/<[^>]*>/g, '')).join(' ').trim();
      } else {
        // 如果没有<p>标签，去除所有HTML标签
        return cleanHtml.replace(/<[^>]*>/g, '').trim();
      }
    } catch {
      // 最后的回退方案
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

interface Column {
  id: string;
  title: string;
  slug: string;
  description: string;
  created_at: string;
}

type ContentItem = Post | Column;

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 10;

  const [mixedContent, setMixedContent] = useState<ContentItem[]>([]);

  const mergeAndSortContent = (posts: Post[], columns: Column[]): ContentItem[] => {
    const allContent: ContentItem[] = [...posts, ...columns];
    return allContent.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const isColumn = (item: ContentItem): item is Column => {
    return 'description' in item;
  };

  const isPost = (item: ContentItem): item is Post => {
    return 'content' in item;
  };

  // 使用缓存获取专栏数据（一次性加载）
  const { 
    data: cachedColumns, 
    error: columnsError 
  } = useCachedData<Column[]>(
    'homepage_columns',
    async () => {
      const { data, error } = await supabase
        .from('columns')
        .select('id, title, slug, description, created_at')
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
      setMixedContent(mergeAndSortContent(posts, cachedColumns));
    }
    if (columnsError) {
      setError(columnsError);
    }
  }, [cachedColumns, columnsError, posts]);

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
        .is('column_id', null)
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
          setMixedContent(mergeAndSortContent([...posts, ...(data || [])], columns));
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
      setMixedContent(mergeAndSortContent(cachedPosts, columns));
      setHasMore(cachedPosts.length === postsPerPage);
    }
    if (postsError) {
      setError(postsError);
    }
  }, [cachedPosts, postsError, columns]);

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
        ) : mixedContent.length === 0 ? (
          <div className="empty-state">暂无内容</div>
        ) : (
          <div className="post-list">
            {/* 混合渲染专栏和文章 */}
            {mixedContent.map((item) => {
              if (isColumn(item)) {
                return <ColumnCard key={item.id} column={item} />;
              } else if (isPost(item)) {
                return (
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
                );
              }
              return null;
            })}
            
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
