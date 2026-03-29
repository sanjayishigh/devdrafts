import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  created_at: string;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor state
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const fetchPosts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, tags, created_at")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!editId) setSlug(slugify(v));
  };

  const handleSave = async () => {
    if (!user || !title.trim() || !slug.trim()) return;
    setSaving(true);
    setError("");

    try {
      if (editId) {
        const { error } = await supabase
          .from("posts")
          .update({ title, slug, content, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) })
          .eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert({
          author_id: user.id,
          title,
          slug,
          content,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        });
        if (error) throw error;
      }
      resetEditor();
      fetchPosts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (post: Post) => {
    const { data } = await supabase.from("posts").select("content").eq("id", post.id).single();
    setEditId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(data?.content || "");
    setTags(post.tags.join(", "));
    setEditing(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
  };

  const resetEditor = () => {
    setEditing(false);
    setEditId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setTags("");
    setError("");
  };

  if (authLoading || loading) {
    return <div className="mx-auto max-w-3xl px-6 pt-24 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-12 pb-24 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Your posts</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" /> New post
          </button>
        )}
      </div>

      {editing && (
        <div className="mb-10 space-y-4 rounded-lg border p-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Post title"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              placeholder="post-slug"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="react, typescript, tutorial"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Content (GitHub-Flavored Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground font-mono leading-6 focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              placeholder="Write your post in Markdown…"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Saving…" : editId ? "Update" : "Publish"}
            </button>
            <button onClick={resetEditor} className="rounded-md border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {posts.length === 0 && !editing ? (
        <p className="text-sm text-muted-foreground">No posts yet. Write your first one!</p>
      ) : (
        <div className="divide-y">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between py-4">
              <div>
                <Link to={`/post/${post.slug}`} className="text-sm font-medium text-foreground hover:underline">
                  {post.title}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(post)} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
