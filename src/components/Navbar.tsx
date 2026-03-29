import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Sun, Moon, Search, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/popular" },
    { name: "Topics", path: "/topics" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
      <div className="flex h-20 w-full items-center justify-between px-4 sm:px-8 max-w-[1600px] mx-auto">
        
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-8 w-8 rounded-xl bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
              <span className="text-background text-sm font-black font-mono">d.</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground hidden sm:block">devdrafts</span>
          </Link>

          <div className="hidden md:flex relative flex-1 max-w-sm">
            <form onSubmit={handleSearch} className="w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="h-11 w-full rounded-2xl border-none bg-secondary/80 pl-11 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
              />
            </form>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-1 mx-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                location.pathname === link.path 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Auth & Actions */}
        <div className="flex items-center justify-end gap-3 flex-1">
          <button 
            onClick={toggle} 
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/dashboard" className="rounded-full px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                Dashboard
              </Link>
              <button onClick={signOut} className="rounded-full px-5 py-2.5 text-sm font-bold border border-border/50 text-foreground hover:bg-secondary transition-all">
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/auth" className="rounded-full px-5 py-2.5 text-sm font-bold border border-border/50 text-foreground hover:bg-secondary transition-all">
                Sign in
              </Link>
              <Link to="/auth" className="rounded-full px-5 py-2.5 text-sm font-bold bg-foreground text-background hover:bg-primary transition-all">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ml-1"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl absolute top-full left-0 w-full p-4 shadow-xl flex flex-col gap-4">
          <form onSubmit={handleSearch} className="relative w-full mb-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-12 w-full rounded-xl bg-secondary pl-11 pr-4 text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </form>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`p-4 rounded-xl text-base font-bold flex items-center justify-between ${
                  location.pathname === link.path 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <hr className="border-border/40 my-2" />

          {user ? (
            <div className="flex flex-col gap-2">
              <Link to="/dashboard" className="p-4 rounded-xl bg-secondary/50 text-center font-bold text-foreground">
                Dashboard
              </Link>
              <button onClick={signOut} className="p-4 rounded-xl text-center font-bold text-muted-foreground hover:bg-secondary">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/auth" className="p-4 rounded-xl bg-foreground text-background text-center font-bold w-full">
                Sign up
              </Link>
              <Link to="/auth" className="p-4 rounded-xl border border-border/50 text-foreground text-center font-bold w-full">
                Sign in
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
