import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/lib/theme";

export default function MarkdownRenderer({ content }: { content: string }) {
  const { theme } = useTheme();

  return (
    <div className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const inline = !match;
          if (inline) {
            return (
              <code className="rounded bg-prose-code-bg px-1.5 py-0.5 text-sm font-mono text-foreground" {...props}>
                {children}
              </code>
            );
          }
          return (
            <SyntaxHighlighter
              style={theme === "dark" ? oneDark : oneLight}
              language={match[1]}
              PreTag="div"
              customStyle={{ 
                margin: 0, 
                borderRadius: "0.5rem", 
                fontSize: "0.875rem",
                backgroundColor: theme === "dark" ? undefined : "hsl(var(--prose-code-bg))",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
        h1: ({ children }) => <h1 className="text-3xl font-bold text-prose-headings mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-semibold text-prose-headings mt-6 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold text-prose-headings mt-5 mb-2">{children}</h3>,
        p: ({ children }) => <p className="text-prose-body leading-7 mb-4">{children}</p>,
        a: ({ children, href }) => <a href={href} className="text-prose-links underline underline-offset-2 hover:opacity-70">{children}</a>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-prose-body space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-prose-body space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,
        blockquote: ({ children }) => <blockquote className="border-l-2 border-border pl-4 italic text-muted-foreground my-4">{children}</blockquote>,
        table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse text-sm">{children}</table></div>,
        th: ({ children }) => <th className="border border-border bg-secondary px-3 py-2 text-left font-semibold text-foreground">{children}</th>,
        td: ({ children }) => <td className="border border-border px-3 py-2 text-prose-body">{children}</td>,
        hr: () => <hr className="my-8 border-border" />,
        img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-lg my-4 max-w-full" />,
        input: ({ checked, ...props }) => (
          <input type="checkbox" checked={checked} readOnly className="mr-2 accent-foreground" {...props} />
        ),
        del: ({ children }) => <del className="text-muted-foreground">{children}</del>,
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
