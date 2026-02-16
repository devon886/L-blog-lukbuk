import React, { useState } from 'react';
import './WriteForm.css';

interface Column {
  id: string;
  title: string;
}

interface WriteFormProps {
  initialContent?: string;
  initialSlug?: string;
  onSubmit: (title: string, content: string, isPublished: boolean, columnId?: string | null, slug?: string) => void;
  isEditing?: boolean;
  columns?: Column[];
  initialColumnId?: string | null;
}

const WriteForm: React.FC<WriteFormProps> = ({ 
  initialContent = '', 
  initialSlug = '',
  onSubmit, 
  isEditing = false,
  columns = [],
  initialColumnId = null
}) => {

  const [content, setContent] = useState(initialContent);
  const [slug, setSlug] = useState(initialSlug);
  const [isPublished, setIsPublished] = useState(true);
  const [columnId, setColumnId] = useState<string | null>(initialColumnId);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const extractedTitle = titleMatch ? titleMatch[1].trim() : '无标题文章';
      const finalSlug = slug.trim() || generateSlug(extractedTitle);
      onSubmit(extractedTitle, content, isPublished, columnId, finalSlug);
    }
  };

  return (
    <div className="write-form-container">
      <form className="write-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="slug" className="form-label">自定义URL（可选）</label>
          <input
            id="slug"
            type="text"
            className="form-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="留空则自动生成，例如：my-first-post"
          />
          <small className="form-hint">URL将显示为：/posts/{slug || 'your-slug'}</small>
        </div>

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
