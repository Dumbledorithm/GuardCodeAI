// File: app/page.tsx

"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import  Header  from '@/components/Header';
import { Hero } from '@/components/Hero';
import  ReviewDisplay  from '@/components/ReviewDisplay';
import { Bot } from '@/components/Icons';
import GitHubReviewer from '@/components/GitHubReviewer'; // Import the new component

export default function Home() {
  const { data: session, status } = useSession();
  const [review, setReview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // This function is now passed to GitHubReviewer and receives the diff content.
  const handleReviewRequest = async (diff: string, language: string) => {
    setIsLoading(true);
    setError(null);
    setReview('');
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The 'code' property now holds the diff from the PR
        body: JSON.stringify({ code: diff, language }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'An unknown error occurred.');
      }
      
      const data = await response.json();
      setReview(data.review);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Header />
      <main className="flex flex-col items-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-4xl">
          <Hero />
          
          {/* Conditionally render content based on authentication status */}
          {status === 'authenticated' && (
            <div className="mt-8">
              <GitHubReviewer onSubmit={handleReviewRequest} isLoading={isLoading} />
            </div>
          )}

          {status === 'unauthenticated' && (
            <div className="mt-8 text-center p-6 rounded-lg bg-gray-900/50 border border-gray-800">
              <p className="text-lg text-gray-300">Please sign in with GitHub to review your pull requests.</p>
            </div>
          )}
          
          {/* Display error messages */}
          {error && <p className="text-red-500 mt-4 text-center">Error: {error}</p>}

          {/* Loading indicator */}
          {isLoading && (
            <div className="w-full mt-8 flex justify-center">
              <div className="text-lg font-semibold text-white flex items-center gap-2">
                <Bot className="h-5 w-5 animate-spin" />
                Generating your review...
              </div>
            </div>
          )}
          
          {/* Display the AI review result */}
          <ReviewDisplay review={review} />
        </div>
      </main>
    </div>
  );
}