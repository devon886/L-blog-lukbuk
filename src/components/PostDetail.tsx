import React from 'react';
import './PostDetail.css';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface PostDetailProps {
  post: Post;
  onEdit?: () => void;
  onDelete?: () => void;
  isAuthor?: boolean;
}

// 提取HTML文档的body内容
const extractBodyContent = (htmlContent: string): string => {
  // 检测是否是完整的HTML文档
  const isFullHtml = htmlContent.trim().startsWith('<html');
  
  if (isFullHtml) {
    // 提取body标签内的内容
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : htmlContent;
  } else {
    // 如果不是完整的HTML文档，直接返回
    return htmlContent;
  }
};

const PostDetail: React.FC<PostDetailProps> = React.memo(({ post, onEdit, onDelete, isAuthor = false }) => {
  return (
    <div className="post-detail">
      <article className="post-content">

        <div className="post-body" dangerouslySetInnerHTML={{ __html: extractBodyContent(post.content) }}></div>
        
        {isAuthor && (onEdit || onDelete) && (
          <div className="post-actions">
            {onEdit && (
              <button className="action-button edit-button" onClick={onEdit}>
                编辑
              </button>
            )}
            {onDelete && (
              <button className="action-button delete-button" onClick={onDelete}>
                删除
              </button>
            )}
          </div>
        )}
      </article>
    </div>
  );
});

export default PostDetail;
