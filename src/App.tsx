import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PostView from "./pages/PostView";
import Popular from "./pages/Popular";
import Topics from "./pages/Topics";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RouteDebugProbe = () => {
  const location = useLocation();

  useEffect(() => {
    // #region agent log
    window.fetch('http://127.0.0.1:7360/ingest/af5995a3-58bd-499f-a090-e40860fbde65',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6973d5'},body:JSON.stringify({sessionId:'6973d5',runId:'post-fix',hypothesisId:'H8',location:'src/App.tsx:RouteDebugProbe',message:'Route change observed',data:{origin:window.location.origin,path:location.pathname,href:window.location.href},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen flex-col w-full relative bg-background">
              <RouteDebugProbe />
              <Navbar />
              <main className="flex-1 w-full mx-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/post/:slug" element={<PostView />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/popular" element={<Popular />} />
                  <Route path="/topics" element={<Topics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
