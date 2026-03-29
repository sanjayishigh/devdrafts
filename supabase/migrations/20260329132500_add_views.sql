-- Add view count to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views BIGINT DEFAULT 0;

-- Create RPC function to increment post views safely
CREATE OR REPLACE FUNCTION increment_post_views(post_slug TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER -- Runs as the definer, bypassing RLS to update views securely
AS $$
  UPDATE public.posts
  SET views = views + 1
  WHERE slug = post_slug;
$$;
