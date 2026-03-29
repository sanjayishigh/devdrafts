import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Sun, Moon, Search } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link to="/" className="text-sm font-semibold tracking-tight text-foreground">
          devdrafts
        </Link>

        <div className="flex items-center gap-1">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="h-8 w-48 rounded-md border bg-secondary px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                onBlur={() => { if (!query) setSearchOpen(false); }}
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-4 w-4" />
            </button>
          )}

          <button onClick={toggle} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <>
              <Link to="/dashboard" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <button onClick={signOut} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
