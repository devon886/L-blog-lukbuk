import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title"></h1>
        <div className="about-content">
          <p>欢迎来到我的博客！</p>
          <p>我是社交博客平台lukbuk的创始人。</p>
          <p>lukbuk是一个专注于内容创作和分享的社交平台，网址为 <a href="https://lukbuk.top" target="_blank" rel="noopener noreferrer">https://lukbuk.top</a></p>
          <p>在这个个人博客中，我会定期更新文章，题材不限，涵盖生活感悟、技术分享、读书心得等各个方面。</p>
          <p>除了这个博客，我也会在lukbuk的社交账号上定期更新文章，欢迎大家前往阅读和交流。</p>
          <img src="/lukbuk.png" alt="lukbuk社交平台" style={{ maxWidth: '100%', margin: '1rem 0' }} />
          <p>联系方式：</p>
          <p>邮箱：<a href="mailto:zlfdevon@gmail.com">zlfdevon@gmail.com</a></p>
          <p>GitHub：<a href="https://github.com/devon886/" target="_blank" rel="noopener noreferrer">https://github.com/devon886/</a></p>
          <p>感谢您的访问和支持！</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
