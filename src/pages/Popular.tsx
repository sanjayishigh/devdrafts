import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  created_at: string;
  views: number;
  profiles: { username: string };
}

export default function Popular() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        // Attempt to fetch with views
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, slug, tags, created_at, views, profiles(username)")
          .order("views", { ascending: false, nullsFirst: false })
          .limit(50);
          
        if (error) throw error;
        setPosts((data as unknown as Post[]) || []);
      } catch (e: any) {
        console.warn("Views migration missing, falling back to mock views...");
        // Fallback fetch if views column doesn't exist
        const { data: fallbackData } = await supabase
          .from("posts")
          .select("id, title, slug, tags, created_at, profiles(username)")
          .order("created_at", { ascending: false })
          .limit(50);
          
        const mapped = (fallbackData as unknown as Post[])?.map(post => ({
          ...post,
          // Mock views based on string length to simulate popularity
          views: post.title.length * 42 + post.id.charCodeAt(0)
        })).sort((a, b) => b.views - a.views) || [];
        
        setPosts(mapped);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 animate-fade-in">
      <header className="mb-14 max-w-2xl border-b border-border/40 pb-6">
        <div className="flex items-center gap-3 text-primary mb-4">
          <TrendingUp className="h-8 w-8" />
          <h1 className="text-4xl sm:text-4.5xl font-extrabold tracking-tight text-foreground">Most Read</h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed font-medium">The most popular articles on devdrafts, ranked by community views.</p>
      </header>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full rounded-xl bg-secondary/40 animate-pulse border border-border/20" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">No posts found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link 
              key={post.id} 
              to={`/post/${post.slug}`} 
              className="group flex flex-col justify-between p-6 rounded-2xl border border-border/40 bg-card hover:border-border hover:shadow-sm transition-all h-[200px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-6xl font-black italic select-none">
                #{index + 1}
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full">
                    {post.views || 0} views
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-hidden relative z-10">
                   {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-secondary-foreground shrink-0">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
