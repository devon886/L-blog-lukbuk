import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import WriteForm from '../components/WriteForm';
import { supabase } from '../supabase/client';

interface Column {
  id: string;
  title: string;
}

const WritePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [loading, setLoading] = useState(false);
  const [initialTitle, setInitialTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);
  const [initialColumnId, setInitialColumnId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 获取所有专栏
        const { data: columnsData, error: columnsError } = await supabase
          .from('columns')
          .select('id, title')
          .order('created_at', { ascending: false });

        if (columnsError) throw columnsError;
        setColumns(columnsData || []);

        // 如果是编辑模式，获取文章数据
        if (editId) {
          const { data: postData, error: postError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', editId)
            .single();

          if (postError) throw postError;
          if (!postData) throw new Error('文章不存在');

          setInitialTitle(postData.title);
          setInitialContent(postData.content);
          setInitialColumnId(postData.column_id || null);
        }
      } catch (err) {
        if (editId) {
          alert('加载文章失败：' + (err as Error).message);
          navigate('/');
        } else {
          console.error('加载专栏数据失败：', err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [editId, navigate]);

  const handleSubmit = async (title: string, content: string, isPublished: boolean, columnId?: string | null) => {
    try {
      setLoading(true);

      const postData = {
        title,
        content,
        is_published: isPublished,
        column_id: columnId || null
      };

      if (editId) {
        // 更新已有文章
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editId);

        if (error) throw error;
        navigate(`/posts/${editId}`);
      } else {
        // 创建新文章
        const { data, error } = await supabase
          .from('posts')
          .insert([postData])
          .select('id')
          .single();

        if (error) throw error;
        navigate(`/posts/${data.id}`);
      }
    } catch (err) {
      alert('保存文章失败：' + (err as Error).message);
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="write-page">
      <div className="container">
        {/* 返回链接 */}
        <div className="back-link">
          <Link to="/">← 返回</Link>
        </div>
        <h1 className="page-title">{editId ? '编辑文章' : '写文章'}</h1>
        <WriteForm
          initialTitle={initialTitle}
          initialContent={initialContent}
          onSubmit={handleSubmit}
          isEditing={!!editId}
          columns={columns}
          initialColumnId={initialColumnId}
        />
      </div>
    </div>
  );
};

export default WritePage;
