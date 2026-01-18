import React, { useState } from 'react';
import './WriteForm.css';

interface Column {
  id: string;
  title: string;
}

interface WriteFormProps {
  initialContent?: string;
  onSubmit: (title: string, content: string, isPublished: boolean, columnId?: string | null) => void;
  isEditing?: boolean;
  columns?: Column[];
  initialColumnId?: string | null;
}

const WriteForm: React.FC<WriteFormProps> = ({ 
  initialContent = '', 
  onSubmit, 
  isEditing = false,
  columns = [],
  initialColumnId = null
}) => {

  const [content, setContent] = useState(initialContent);
  const [isPublished, setIsPublished] = useState(true);
  const [columnId, setColumnId] = useState<string | null>(initialColumnId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      // 从内容中提取标题
      const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const extractedTitle = titleMatch ? titleMatch[1].trim() : '无标题文章';
      onSubmit(extractedTitle, content, isPublished, columnId);
    }
  };

  return (
    <div className="write-form-container">
      <form className="write-form" onSubmit={handleSubmit}>


        <div className="form-group">
          <label htmlFor="content" className="form-label">内容</label>
          <textarea
            id="content"
            className="form-input content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始写作...\n\n支持HTML格式，例如：h2/h3标题、strong/bold加粗、em/italic斜体等"
            rows={15}
            required
          />
        </div>

        {/* 专栏选择字段 */}
        {columns.length > 0 && (
          <div className="form-group">
            <label htmlFor="column" className="form-label">选择专栏</label>
            <select
              id="column"
              className="form-input"
              value={columnId || ''}
              onChange={(e) => setColumnId(e.target.value || null)}
            >
              <option value="">不选择专栏</option>
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-actions">
          <div className="publish-toggle">
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label htmlFor="publish">立即发布</label>
          </div>

          <button type="submit" className="submit-button">
            {isEditing ? '更新文章' : '发布文章'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteForm;
