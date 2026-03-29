import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t py-12">
      <div className="mx-auto max-w-3xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-sm font-medium text-foreground">
            © {new Date().getFullYear()} Sanjay. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Simple, fast, readable.
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <a href="https://github.com/sanjayishigh" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </a>
          {/* <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors" aria-label="Twitter">
            <Twitter className="h-4 w-4" />
          </a> */}
          <a href="https://linkedin.com/in/sanjay-c-m" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href="mailto:sanjayishigh@gmail.com" className="hover:text-foreground transition-colors" aria-label="Email">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
