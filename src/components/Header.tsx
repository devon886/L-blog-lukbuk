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
          
          <div className="nav-right">
            {CONFIG.ADMIN_ENABLED ? (
              user ? (
                <Link to="/write" className="nav-link write-link">
                  写文章
                </Link>
              ) : (
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
