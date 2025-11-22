"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header  from '@/components/Header';
import { Hero } from '@/components/Hero';
import  ReviewDisplay  from '@/components/ReviewDisplay';
import { Bot } from '@/components/Icons';
import { ReviewDetails } from '@/components/GitHubReviewer';
import ReviewInterface from '@/components/ReviewInterface';
import { ProgressChart } from '@/components/ProgressChart';
import { ReviewHistory } from '@/components/ReviewHistory';

interface HistoricalReview {
  id: string;
  repo: string;
  prTitle: string;
  qualityScore: number;
  createdAt: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [currentReview, setCurrentReview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewHistory, setReviewHistory] = useState<HistoricalReview[]>([]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchHistory = async () => {
        try {
          const res = await fetch('/api/reviews');
          if (res.ok) setReviewHistory(await res.json());
        } catch (err) { console.error("Failed to fetch history", err); }
      };
      fetchHistory();
    }
  }, [status]);

  const handleReviewRequest = async (code: string, language: string, details: ReviewDetails, isDiff: boolean) => {
    setIsLoading(true);
    setError(null);
    setCurrentReview('');

    try {
      const aiResponse = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, isDiff }), // Pass the isDiff flag
      });

      if (!aiResponse.ok) throw new Error('Failed to get review from AI.');
      
      const { reviewText, qualityScore } = await aiResponse.json();
      setCurrentReview(reviewText);

      const saveResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, reviewText, qualityScore }),
      });

      if (!saveResponse.ok) throw new Error('Failed to save the new review.');
      
      const newReview = await saveResponse.json();
      setReviewHistory(prev => [newReview, ...prev]);

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
          
          {status === 'authenticated' ? (
            <div className="mt-8">
              <ReviewInterface onSubmit={handleReviewRequest} isLoading={isLoading} />
              
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
                <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
                  <ProgressChart data={reviewHistory} />
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-4">Recent Reviews</h2>
                 <ReviewHistory reviews={reviewHistory} />
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <p className="text-lg text-gray-300">Sign in with GitHub to review PRs and track your code quality over time.</p>
            </div>
          )}
          
          {error && <p className="text-red-500 mt-4 text-center">Error: {error}</p>}

          {isLoading && (
            <div className="w-full mt-8 text-center text-lg text-white">
              <p><Bot className="h-5 w-5 animate-spin inline mr-2" />Generating and saving your review...</p>
            </div>
          )}
          
          <ReviewDisplay review={currentReview} />
        </div>
      </main>
    </div>
  );
}