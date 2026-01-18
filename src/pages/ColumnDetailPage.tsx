import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import PostList from '../components/PostList';
import './ColumnDetailPage.css';

interface Column {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const ColumnDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [column, setColumn] = useState<Column | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('专栏ID不存在');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 并行获取专栏详情和该专栏下的文章
        const [columnResult, postsResult] = await Promise.all([
          supabase
            .from('columns')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('posts')
            .select('*')
            .eq('column_id', id)
            .eq('is_published', true)
            .order('created_at', { ascending: false })
        ]);

        if (columnResult.error) throw columnResult.error;
        if (postsResult.error) throw postsResult.error;

        setColumn(columnResult.data);
        setPosts(postsResult.data || []);
      } catch (err) {
        setError('获取专栏详情失败');
        console.error('Error fetching column detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error || !column) {
    return <div className="error">{error || '专栏不存在'}</div>;
  }

  return (
    <div className="column-detail-page">
      <div className="container">
        {/* 返回链接 */}
        <div className="back-link">
          <Link to="/">← 返回</Link>
        </div>

        {/* 主内容区域 */}
        <div className="content-wrapper">
          {/* 左侧目录 */}
          <aside className="column-toc">
            <h2 className="toc-title">目录</h2>
            <nav className="toc-nav">
              {posts.length === 0 ? (
                <p className="empty-toc">暂无文章</p>
              ) : (
                <ul className="toc-list">
                  {posts.map((post, index) => (
                    <li key={post.id} className="toc-item">
                      <a 
                        href={`#post-${index + 1}`} 
                        className="toc-link"
                      >
                        {index + 1}. {post.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </aside>

          {/* 右侧文章列表 */}
          <main className="column-content">
            <h2 className="section-title">文章列表</h2>
            {posts.length === 0 ? (
              <div className="empty-state">该专栏暂无文章</div>
            ) : (
              <div className="post-with-ids">
                {posts.map((post, index) => (
                  <div 
                    key={post.id} 
                    id={`post-${index + 1}`} 
                    className="post-item-container"
                  >
                    <PostList posts={[post]} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ColumnDetailPage;