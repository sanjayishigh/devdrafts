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
        .limit(50);
      setPosts((data as unknown as Post[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 pt-12 pb-24 animate-fade-in">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">blog.</h1>
        <p className="text-sm text-muted-foreground mt-1">Thoughts on code, design, and everything in between.</p>
      </header>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-md bg-secondary animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet. Be the first to write one!</p>
      ) : (
        <div className="divide-y">
          {posts.map((post) => (
            <Link key={post.id} to={`/post/${post.slug}`} className="block py-5 group">
              <h2 className="text-base font-semibold text-foreground group-hover:underline leading-snug">{post.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-medium text-foreground/70">{post.profiles?.username}</span>
                <span className="mx-1.5">·</span>
                {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                {post.tags.length > 0 && (
                  <>
                    <span className="mx-1.5">·</span>
                    {post.tags.map((tag) => (
                      <span key={tag} className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground mr-1">
                        {tag}
                      </span>
                    ))}
                  </>
                )}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
