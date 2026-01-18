import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CONFIG } from '../config';
import './Header.css';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1 className="site-title">首页</h1>
          </Link>
          
          <Link to="/about" className="nav-link">
            关于
          </Link>
          
          <div className="nav-right">
            {CONFIG.ADMIN_ENABLED ? (
              user ? (
                // 登录状态：显示写文章和创建专栏
                <>
                  <Link to="/write" className="nav-link write-link">
                    写文章
                  </Link>
                  <Link to="/create-column" className="nav-link write-link">
                    创建专栏
                  </Link>
                </>
              ) : (
                // 未登录状态：显示登录
                <Link to="/login" className="nav-link">
                  登录
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
