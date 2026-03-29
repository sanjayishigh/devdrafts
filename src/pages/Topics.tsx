import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tags as TagsIcon, Filter, Layers } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  created_at: string;
  profiles: { username: string };
}

export default function Topics() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tag Sync via URL
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeParam = searchParams.get('tag');
  const [activeTag, setActiveTag] = useState<string | null>(activeParam);

  useEffect(() => {
    const urlTag = searchParams.get('tag');
    setActiveTag(urlTag);
  }, [location.search]);

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

  const tags = useMemo(() => {
    const tagMap = new Map<string, number>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeTag === 'all' || !activeTag) return posts;
    return posts.filter((post) => post.tags.includes(activeTag));
  }, [posts, activeTag]);

  const handleTagClick = (tag: string) => {
    if (tag === activeTag) {
      navigate('/topics'); // Deselect if clicking the same tag
    } else if (tag === 'all') {
      navigate('/topics');
    } else {
      navigate(`/topics?tag=${tag}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 animate-fade-in flex flex-col gap-16">
      
      {/* Topics Header & Interactive Grid */}
      <section className="w-full">
        <header className="mb-14 max-w-2xl border-b border-border/40 pb-6">
          <div className="flex items-center gap-3 text-primary mb-4">
            <Layers className="h-8 w-8" />
            <h1 className="text-4xl sm:text-4xl font-extrabold tracking-tight text-foreground">Explore</h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">Filter the developer timeline by specific tags, technologies, and concepts. Browse precisely what you want to read.</p>
        </header>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleTagClick('all')}
              className={`flex items-center justify-center px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${(!activeTag || activeTag === 'all') ? 'bg-primary text-primary-foreground border-primary shadow-sm z-10' : 'bg-secondary/50 text-muted-foreground border-transparent hover:border-border hover:bg-secondary'}`}
            >
              <span>All Topics</span>
              <span className={`ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${(!activeTag || activeTag === 'all') ? 'bg-background/20 text-primary-foreground' : 'bg-background/50 text-muted-foreground'}`}>
                {posts.length}
              </span>
            </button>
            
            {tags.map(([tag, count]) => (
              <button 
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`flex items-center justify-center px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${activeTag === tag ? 'bg-primary text-primary-foreground border-primary shadow-sm z-10' : 'bg-secondary/50 text-muted-foreground border-transparent hover:border-border hover:bg-secondary'}`}
              >
                <span className="capitalize">{tag}</span>
                <span className={`ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${activeTag === tag ? 'bg-background/20 text-primary-foreground' : 'bg-background/50 text-muted-foreground'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Topics Content Engine */}
      <main className="flex-1 w-full pt-8 border-t border-border/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {(!activeTag || activeTag === 'all') ? "Universal Feed" : `Articles mapped to "${activeTag}"`}
            </h2>
          </div>
          <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/40">
            {filteredPosts.length} Results
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 w-full rounded-2xl bg-secondary/40 animate-pulse border border-border/20" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-secondary/10 rounded-3xl border border-dashed border-border/60 px-6 max-w-2xl mx-auto">
            <TagsIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold mb-2">No active signal</h3>
            <p className="font-medium text-muted-foreground">Select an active topic from the taxonomy grid above to filter the timeline.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/post/${post.slug}`} 
                className="group flex flex-col justify-between p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-md transition-all h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <time className="text-xs font-mono font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                      {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                    <span className="text-primary bg-primary/10 rounded-full p-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-3 leading-snug">
                    {post.title}
                  </h3>
                </div>
                
                <div className="flex items-center mt-auto pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                       {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-foreground tracking-tight">{post.profiles?.username}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
