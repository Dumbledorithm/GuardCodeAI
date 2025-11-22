"use client";

import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ReviewDetails } from './GitHubReviewer'; // Re-using this type for consistency

interface SnippetReviewerProps {
  onSubmit: (code: string, language: string, details: ReviewDetails) => void;
  isLoading: boolean;
}

export default function SnippetReviewer({ onSubmit, isLoading }: SnippetReviewerProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create placeholder details for snippet reviews
    const details: ReviewDetails = {
        repo: 'Code Snippet',
        prNumber: 0,
        prTitle: `Pasted snippet (${new Date().toLocaleTimeString()})`,
    };
    onSubmit(code, language, details);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <Textarea
          placeholder="// Paste your code snippet here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isLoading}
          className="min-h-[250px] md:min-h-[350px]"
        />
      </div>
      <div className="flex justify-between items-center">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isLoading}
          className="h-10 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
        <Button type="submit" disabled={isLoading || !code.trim()}>
          {isLoading ? 'Reviewing...' : 'Review Snippet'}
        </Button>
      </div>
    </form>
  );
};