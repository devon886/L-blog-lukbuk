import React from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface PostListProps {
  posts: Post[];
}

// 从HTML的<p>标签中提取纯文本，过滤掉注释
const extractPlainText = (htmlContent: string): string => {
  if (!htmlContent) return '';
  
  try {
    // 首先去除所有HTML注释
    let cleanHtml = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
    
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
    } catch (fallbackError) {
      // 最后的回退方案
      return '';
    }
  }
};

const PostList: React.FC<PostListProps> = React.memo(({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <div className="post-header">
            <Link to={`/posts/${post.id}`} className="post-link">
              <h2 className="post-title truncate-title">
                {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
              </h2>
            </Link>
            <div className="post-meta">
              <time className="post-date">
                {new Date(post.created_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric'
                }).replace(/\./g, '/')}
              </time>
            </div>
          </div>
          <p className="post-excerpt">
            {(() => {
              const plainText = extractPlainText(post.content);
              return plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText;
            })()}
          </p>
        </div>
      ))}
    </div>
  );
});

export default PostList;
