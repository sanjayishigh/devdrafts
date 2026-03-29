import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  created_at: string;
  profiles: { username: string };
}

export default function Index() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, tags, created_at, profiles(username)")
        .order("created_at", { ascending: false })
        .limit(100);
      setPosts((data as unknown as Post[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 animate-fade-in">
      {/* Hero Section */}
      <header className="mb-14 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          hey, i build stuff
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
          writing about code, design, and building things that actually work
        </p>
      </header>

      {/* Posts Directory */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-6 pb-2 border-b border-border/40">Latest Articles</h2>
        
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 w-full rounded-xl bg-secondary/40 animate-pulse border border-border/20" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                to={`/post/${post.slug}`} 
                className="group flex flex-col justify-between p-6 rounded-2xl border border-border/40 bg-card hover:border-border hover:shadow-sm transition-all h-[200px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <time className="text-xs font-mono text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                    <span className="text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      →
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </div>
                
                {post.tags.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-hidden">
                     {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-secondary-foreground shrink-0">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-1 text-[10px] font-semibold text-muted-foreground shrink-0">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
