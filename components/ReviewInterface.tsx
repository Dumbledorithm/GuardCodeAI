"use client";

import React, { useState } from 'react';
import GitHubReviewer, { ReviewDetails } from './GitHubReviewer';
import SnippetReviewer from './SnippetReviewer';

interface ReviewInterfaceProps {
    onSubmit: (code: string, language: string, details: ReviewDetails, isDiff: boolean) => void;
    isLoading: boolean;
}

type ReviewMode = 'pr' | 'snippet';

export default function ReviewInterface({ onSubmit, isLoading }: ReviewInterfaceProps) {
    const [mode, setMode] = useState<ReviewMode>('pr');

    const activeTab = "border-blue-500 text-white";
    const inactiveTab = "border-transparent text-gray-400 hover:text-white hover:border-gray-700";

    const handleGitHubSubmit = (diff: string, language: string, details: ReviewDetails) => {
        onSubmit(diff, language, details, true); // isDiff is true
    };
    
    const handleSnippetSubmit = (code: string, language: string, details: ReviewDetails) => {
        onSubmit(code, language, details, false); // isDiff is false
    };

    return (
        <div className="mt-8 p-6 rounded-lg bg-gray-900/50 border border-gray-800 space-y-4 shadow-lg">
            <div className="border-b border-gray-800">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setMode('pr')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${mode === 'pr' ? activeTab : inactiveTab}`}
                    >
                        Review Pull Request
                    </button>
                    <button
                        onClick={() => setMode('snippet')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${mode === 'snippet' ? activeTab : inactiveTab}`}
                    >
                        Review Code Snippet
                    </button>
                </nav>
            </div>
            
            {mode === 'pr' && <GitHubReviewer onSubmit={handleGitHubSubmit} isLoading={isLoading} />}
            {mode === 'snippet' && <SnippetReviewer onSubmit={handleSnippetSubmit} isLoading={isLoading} />}
        </div>
    );
}