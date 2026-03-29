import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PostResult {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  created_at: string;
  profiles: { username: string };
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      const pattern = `%${q}%`;
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, tags, created_at, profiles(username)")
        .or(`title.ilike.${pattern},slug.ilike.${pattern},tags.cs.{${q}}`)
        .order("created_at", { ascending: false })
        .limit(30);
      setResults((data as unknown as PostResult[]) || []);
      setLoading(false);
    };
    if (q) search();
    else { setResults([]); setLoading(false); }
  }, [q]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 animate-fade-in">
      <header className="mb-14 max-w-2xl border-b border-border/40 pb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Search Directory
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
          {q ? `Viewing active results for "${q}"` : "Enter a query above to search all published posts."}
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground">Searching…</p>
      ) : results.length === 0 && q ? (
        <p className="text-sm text-muted-foreground">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((post) => (
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
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
