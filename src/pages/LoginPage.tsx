import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const form = e.currentTarget as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    
    if (!email.trim() || !password.trim()) {
      clearError();
      return;
    }

    try {
      await login(email, password);
      // 登录成功后重定向到首页
      navigate('/');
    } catch (error) {
      // 错误已在useAuth中处理
    }
  };

  return (
    <div>
      <h2>登录</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">邮箱:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">密码:</label>
          <input type="password" id="password" name="password" required minLength={6} />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
