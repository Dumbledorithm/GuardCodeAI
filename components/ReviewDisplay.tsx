import React,{useState} from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bot,Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import remarkGfm from 'remark-gfm'; // This is temporarily commented out to resolve a build error.

interface ReviewDisplayProps {
  review: string;
}

const ExplainButton = ({ topic }: { topic: string }) => {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchExplanation = async () => {
        if (explanation) return; // Don't re-fetch if we already have it
        setIsLoading(true);
        try {
            const res = await fetch('/api/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });
            if (res.ok) {
                const data = await res.json();
                setExplanation(data.explanation);
            } else {
                setExplanation('Sorry, I could not fetch an explanation for this topic.');
            }
        } catch (error) {
            console.error('Failed to fetch explanation', error);
            setExplanation('An error occurred while fetching the explanation.');
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2 py-0 h-6 px-2 border-blue-500/50 text-blue-300 hover:bg-blue-900/50 hover:text-blue-200" onClick={fetchExplanation}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Explain
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] bg-gray-950 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl text-teal-300">{topic.replace(/_/g, ' ')}</DialogTitle>
                </DialogHeader>
                <div className="prose prose-invert prose-sm max-w-none max-h-[60vh] overflow-y-auto p-1">
                    {isLoading ? <p>Generating explanation...</p> : <ReactMarkdown>{explanation}</ReactMarkdown>}
                </div>
            </DialogContent>
        </Dialog>
    );
};

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
            <div className="prose prose-invert prose-sm max-w-none text-white">
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
                        <code className="bg-gray-700 text-white rounded-sm px-1 py-0.5 font-mono text-sm" {...rest}>
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
