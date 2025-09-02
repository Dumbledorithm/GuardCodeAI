import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm'; // This is temporarily commented out to resolve a build error.

interface ReviewDisplayProps {
  review: string;
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ review }) => {
  if (!review) return null;

  return (
    <div className="w-full max-w-4xl mt-8">
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <Bot className="h-5 w-5" />
        AI Review:
      </h3>
      <Card className="bg-gray-900/50 border-gray-700 shadow-lg">
        <CardContent className="p-6">
            <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown 
                  // remarkPlugins={[remarkGfm]} // This is temporarily commented out.
                  components={{
                    p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                    code(props) {
                      const { children, className, node, ...rest } = props
                      const match = /language-(\w+)/.exec(className || '')
                      return match ? (
                        <div className="bg-gray-800 rounded-md p-4 my-4 overflow-x-auto">
                           <pre className="text-sm"><code className={className} {...rest}>{children}</code></pre>
                        </div>
                      ) : (
                        <code className="bg-gray-700 text-blue-300 rounded-sm px-1 py-0.5 font-mono text-sm" {...rest}>
                          {children}
                        </code>
                      )
                    },
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 my-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-4 space-y-2" {...props} />,
                  }}
                >
                  {review}
                </ReactMarkdown>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewDisplay;
