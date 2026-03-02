import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100 transition-colors duration-300" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100 transition-colors duration-300" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-md font-bold mt-3 mb-2 text-slate-900 dark:text-slate-100 transition-colors duration-300" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm font-bold mt-3 mb-1 text-slate-900 dark:text-slate-100 transition-colors duration-300" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 leading-relaxed text-slate-700 dark:text-slate-300 transition-colors duration-300" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:underline transition-colors duration-300" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside ml-4 mb-2 text-slate-700 dark:text-slate-300 transition-colors duration-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside ml-4 mb-2 text-slate-700 dark:text-slate-300 transition-colors duration-300" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1 text-slate-700 dark:text-slate-300 transition-colors duration-300" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic text-slate-800 dark:text-slate-200 transition-colors duration-300" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic text-slate-600 dark:text-slate-400 my-4 transition-colors duration-300"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-1 rounded font-mono text-sm transition-colors duration-300"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="bg-neutral-800 text-white p-3 rounded-md overflow-x-auto font-mono text-sm my-4"
              {...props}
            />
          ),
        }}
      >{content}</ReactMarkdown>

    </div>
  );
};

export default MarkdownRenderer;
