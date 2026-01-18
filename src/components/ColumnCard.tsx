import React from 'react';
import { Link } from 'react-router-dom';

interface Column {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface ColumnCardProps {
  column: Column;
}

const ColumnCard: React.FC<ColumnCardProps> = ({ column }) => {
  return (
    <div className="post-item">
      <div className="post-header">
        <Link to={`/columns/${column.id}`} className="post-link">
          <h2 className="post-title">{column.title}</h2>
        </Link>
        <div className="post-meta">
          <time className="post-date">
            {new Date(column.created_at).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
      </div>
      <p className="post-excerpt">{column.description}</p>
    </div>
  );
};

export default React.memo(ColumnCard);
