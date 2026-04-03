import React from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

interface PostListProps {
  posts: Post[];
}

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

const PostList: React.FC<PostListProps> = React.memo(({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <div className="post-header">
            <Link to={`/posts/${post.slug}`} className="post-link">
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
