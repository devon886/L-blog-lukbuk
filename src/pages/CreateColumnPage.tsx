import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { CONFIG } from '../config';
import { useAuth } from '../contexts/AuthContext';
import './CreateColumnPage.css';

const CreateColumnPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  // 检查管理功能是否启用
  useEffect(() => {
    if (!CONFIG.ADMIN_ENABLED) {
      navigate('/');
    }
  }, [navigate]);
  
  // 检查用户是否登录
  useEffect(() => {
    if (!authLoading && !user) {
      // 未登录用户重定向到登录页面
      navigate('/login', { state: { message: '请先登录才能创建专栏' } });
    }
  }, [user, authLoading, navigate]);

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      setError('请填写专栏标题和简介');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('columns')
        .insert([{ title, description }])
        .select()
        .single();

      if (error) throw error;

      // 清除首页的专栏缓存，确保首页能显示最新内容
      localStorage.removeItem('homepage_columns');

      // 创建成功后重定向到首页
      navigate('/');
    } catch (err) {
      setError('创建专栏失败，请重试');
      console.error('Error creating column:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-column-page">
      <div className="container">
        {/* 返回链接 */}
        <div className="back-link">
          <Link to="/">← 返回</Link>
        </div>
        <h1 className="page-title">创建专栏</h1>
        
        {error && <div className="error">{error}</div>}
        
        <form className="create-column-form" onSubmit={handleCreateColumn}>
          <div className="form-group">
            <label htmlFor="title">专栏标题</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入专栏标题"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">专栏简介</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入专栏简介"
              rows={5}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading}
            >
              {isLoading ? '创建中...' : '创建专栏'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColumnPage;