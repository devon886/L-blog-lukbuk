-- 启用uuid扩展（Supabase默认已启用，但最好明确声明）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建posts表（简化版，不包含用户认证字段）
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 为updated_at字段创建自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 启用RLS（行级安全性）
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 设置RLS策略，允许公开读取已发布的文章
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Public posts are viewable by everyone') THEN
    CREATE POLICY "Public posts are viewable by everyone" ON posts
      FOR SELECT USING (is_published = true);
  END IF;
END
$$;

-- 设置RLS策略，允许公开创建新文章
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Anyone can create posts') THEN
    CREATE POLICY "Anyone can create posts" ON posts
      FOR INSERT WITH CHECK (true);
  END IF;
END
$$;

-- 设置RLS策略，允许公开更新和删除文章
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Anyone can update their own posts') THEN
    CREATE POLICY "Anyone can update their own posts" ON posts
      FOR UPDATE USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Anyone can delete their own posts') THEN
    CREATE POLICY "Anyone can delete their own posts" ON posts
      FOR DELETE USING (true);
  END IF;
END
$$;

-- 创建columns表（专栏表）
CREATE TABLE IF NOT EXISTS columns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 为columns表的updated_at字段创建自动更新触发器
CREATE OR REPLACE TRIGGER update_columns_updated_at
BEFORE UPDATE ON columns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 启用RLS（行级安全性）
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;

-- 设置RLS策略，允许公开读取专栏
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'columns' AND policyname = 'Public columns are viewable by everyone') THEN
    CREATE POLICY "Public columns are viewable by everyone" ON columns
      FOR SELECT USING (true);
  END IF;
END
$$;

-- 设置RLS策略，只允许登录用户创建新专栏
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'columns' AND policyname = 'Anyone can create columns') THEN
    CREATE POLICY "Anyone can create columns" ON columns
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END
$$;

-- 设置RLS策略，只允许登录用户更新专栏
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'columns' AND policyname = 'Anyone can update their own columns') THEN
    CREATE POLICY "Anyone can update their own columns" ON columns
      FOR UPDATE USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END
$$;

-- 设置RLS策略，只允许登录用户删除专栏
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'columns' AND policyname = 'Anyone can delete their own columns') THEN
    CREATE POLICY "Anyone can delete their own columns" ON columns
      FOR DELETE USING (auth.uid() IS NOT NULL);
  END IF;
END
$$;

-- 修改posts表，添加column_id字段关联专栏
ALTER TABLE posts ADD COLUMN IF NOT EXISTS column_id UUID REFERENCES columns(id);

-- 添加slug字段用于自定义URL（如果表已存在）
ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 为现有文章生成slug（基于标题）
UPDATE posts SET slug = 
  LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\u4e00-\u9fa5\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  )
WHERE slug IS NULL;

-- 为columns表添加slug字段（如果表已存在）
ALTER TABLE columns ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 为现有专栏生成slug（基于标题）
UPDATE columns SET slug = 
  LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\u4e00-\u9fa5\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  )
WHERE slug IS NULL;
-- 查询所有已发布的文章
SELECT * FROM posts WHERE is_published = true ORDER BY created_at DESC;

-- 查询所有专栏
SELECT * FROM columns ORDER BY created_at DESC;

-- 显示表结构（使用标准SQL查询）
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'columns'
ORDER BY ordinal_position;

-- 显示RLS策略（使用标准SQL查询）
SELECT * FROM pg_policies WHERE tablename = 'posts';
SELECT * FROM pg_policies WHERE tablename = 'columns';
