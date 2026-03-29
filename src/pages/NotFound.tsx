import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // #region agent log
    window.fetch('http://127.0.0.1:7360/ingest/af5995a3-58bd-499f-a090-e40860fbde65',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6973d5'},body:JSON.stringify({sessionId:'6973d5',runId:'post-fix',hypothesisId:'H5',location:'src/pages/NotFound.tsx:useEffect',message:'Router fallback not found rendered',data:{path:location.pathname},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
