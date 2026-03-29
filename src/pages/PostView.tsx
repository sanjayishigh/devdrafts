import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Loader2 } from "lucide-react";

interface PostData {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  profiles: { username: string; avatar_url: string | null };
}

export default function PostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, content, tags, created_at, profiles(username, avatar_url)")
        .eq("slug", slug)
        .single();
      setPost(data as unknown as PostData);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center px-6 pt-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 pt-24 text-center text-sm text-muted-foreground">
        404 - Post Not Found
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pt-12 pb-24 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight mb-3">{post.title}</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{post.profiles?.username}</span>
          <span>·</span>
          <time>{new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <MarkdownRenderer content={post.content} />
    </article>
  );
}
