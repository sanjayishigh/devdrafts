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
    <div className="mx-auto max-w-3xl px-6 pt-12 pb-24 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-2">Search</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {q ? `Results for "${q}"` : "Enter a query to search posts"}
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Searching…</p>
      ) : results.length === 0 && q ? (
        <p className="text-sm text-muted-foreground">No posts found.</p>
      ) : (
        <div className="divide-y">
          {results.map((post) => (
            <Link key={post.id} to={`/post/${post.slug}`} className="block py-4 group">
              <h2 className="text-sm font-medium text-foreground group-hover:underline">{post.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {post.profiles?.username} · {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
