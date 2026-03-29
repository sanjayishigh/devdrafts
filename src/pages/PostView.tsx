import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Loader2, ArrowLeft } from "lucide-react";

interface PostData {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  views?: number;
  profiles: { username: string; avatar_url: string | null };
}

export default function PostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // 1. Fetch Post Data
      const { data } = await supabase
        .from("posts")
        .select("id, title, content, tags, created_at, views, profiles(username, avatar_url)")
        .eq("slug", slug)
        .single();
      
      setPost(data as unknown as PostData);
      setLoading(false);

      // 2. Increment Views asynchronously without blocking render
      if (slug) {
        (supabase.rpc as any)("increment_post_views", { post_slug: slug }).then(({ error }: any) => {
          if (error) console.error("Error incrementing views. Migration missing?", error);
        });
      }
    };
    fetch();
  }, [slug]);

  const readingTime = useMemo(() => {
    if (!post?.content) return 1;
    const words = post.content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 225));
  }, [post?.content]);

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-32 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-32 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">404 - Post Not Found</h1>
        <p className="text-muted-foreground mb-8 text-center">The post you are looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-24 animate-fade-in relative flex justify-center">
      <div className="w-full max-w-3xl border-l border-r border-border/20 px-4 sm:px-8 md:px-12 py-8 bg-card rounded-2xl shadow-sm">
        <div className="mb-10">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" /> 
            Back to posts
          </Link>
        </div>

        <header className="mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground overflow-hidden">
                {post.profiles?.avatar_url ? (
                  <img src={post.profiles.avatar_url} alt={post.profiles?.username} className="h-full w-full object-cover" />
                ) : (
                  post.profiles?.username?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground leading-tight">{post.profiles?.username}</span>
                <span className="text-xs">{readingTime} min read</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <time className="font-mono text-xs">
                {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", weekday: "short" })}
              </time>
              {post.views !== undefined && (
                <div className="flex items-center text-xs font-mono bg-primary/10 text-primary/80 px-2 py-0.5 rounded pl-1.5">
                  <span className="mr-1.5">👁</span> {post.views} views
                </div>
              )}
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <Link to={`/topics?tag=${tag}`} key={tag} className="inline-flex items-center rounded-md border border-border/50 bg-background hover:bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>
        
        <div className="prose-container relative">
          <MarkdownRenderer content={post.content} />
        </div>

        <hr className="my-16 border-border border-dashed" />
        
        <div className="text-center pb-8 pt-8 bg-secondary/20 rounded-2xl">
          <p className="text-muted-foreground italic font-medium">Thanks for reading this entry.</p>
          <Link to="/" className="inline-flex items-center font-bold hover:underline mt-4 text-primary bg-background px-4 py-2 rounded-full shadow-sm border border-border/50">
            Read more posts <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
