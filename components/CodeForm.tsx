"use client";

import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from '@/components/Icons';

interface CodeFormProps {
  onSubmit: (code: string, language: string) => Promise<void>;
  isLoading: boolean;
}

 const CodeForm: React.FC<CodeFormProps> = ({ onSubmit, isLoading }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code, language);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <div className="p-4 border-b border-gray-800">
            <p className="text-sm text-gray-300">Paste your code for an instant AI review</p>
        </div>
        <Textarea
          placeholder="// Your code starts here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isLoading}
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
          {isLoading ? 'Reviewing...' : <> <Wand2 className="mr-2 h-4 w-4" /> Review My Code </>}
        </Button>
      </div>
    </form>
  );
};

export default CodeForm;