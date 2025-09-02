// File: app/components/GitHubReviewer.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Define TypeScript types for the data we expect from our APIs
type Repo = {
  owner: string;
  name: string;
};

type PullRequest = {
  number: number;
  title: string;
};

interface GitHubReviewerProps {
  // This function will be passed from the main page to handle the final submission
  onSubmit: (diff: string, language: string) => void;
  // This prop tells the component if an AI review is already in progress
  isLoading: boolean;
}

export default function GitHubReviewer({ onSubmit, isLoading }: GitHubReviewerProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<string>("");

  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isLoadingPRs, setIsLoadingPRs] = useState(false);

  // Effect to fetch repositories once when the component loads
  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoadingRepos(true);
      try {
        const response = await fetch("/api/github/repos");
        if (response.ok) {
          setRepos(await response.json());
        } else {
          console.error("Failed to fetch repos");
        }
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
      setIsLoadingRepos(false);
    };
    fetchRepos();
  }, []);

  // Effect to fetch pull requests whenever a repository is selected
  useEffect(() => {
    if (!selectedRepo) {
      setPullRequests([]);
      setSelectedPR("");
      return;
    }

    const [owner, repo] = selectedRepo.split('/');
    const fetchPRs = async () => {
      setIsLoadingPRs(true);
      setPullRequests([]); // Clear previous PRs
      setSelectedPR("");   // Reset selected PR
      try {
        const response = await fetch(`/api/github/prs?owner=${owner}&repo=${repo}`);
        if (response.ok) {
          setPullRequests(await response.json());
        } else {
          console.error("Failed to fetch PRs");
        }
      } catch (error) {
        console.error("Error fetching PRs:", error);
      }
      setIsLoadingPRs(false);
    };
    fetchPRs();
  }, [selectedRepo]);

  // Handler to fetch the diff and submit it for review
  const handleReview = async () => {
    if (!selectedRepo || !selectedPR) return;

    const [owner, repo] = selectedRepo.split('/');
    try {
      const response = await fetch(`/api/github/diff?owner=${owner}&repo=${repo}&pull_number=${selectedPR}`);
      if (response.ok) {
        const diffText = await response.text();
        // We pass the fetched diff up to the parent page.
        // For simplicity, we assume 'typescript'. A future improvement could be detecting this.
        onSubmit(diffText, 'typescript');
      } else {
         console.error("Failed to fetch diff");
      }
    } catch (error) {
      console.error("Error fetching diff:", error);
    }
  };

  return (
    <div className="mt-8 p-6 rounded-lg bg-gray-900/50 border border-gray-800 space-y-4 shadow-lg">
      <h2 className="text-xl font-bold text-white">Review a Pull Request</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Repository Selector */}
        <div>
          <label htmlFor="repo-select" className="block text-sm font-medium text-gray-400 mb-2">
            1. Select a Repository
          </label>
          <select
            id="repo-select"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            disabled={isLoadingRepos || isLoading}
            className="h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
          >
            <option value="">{isLoadingRepos ? "Loading repos..." : "Choose a repository"}</option>
            {repos.map((repo) => (
              <option key={`${repo.owner}/${repo.name}`} value={`${repo.owner}/${repo.name}`}>
                {repo.owner}/{repo.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pull Request Selector */}
        <div>
          <label htmlFor="pr-select" className="block text-sm font-medium text-gray-400 mb-2">
            2. Select a Pull Request
          </label>
          <select
            id="pr-select"
            value={selectedPR}
            onChange={(e) => setSelectedPR(e.target.value)}
            disabled={!selectedRepo || isLoadingPRs || isLoading}
            className="h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
          >
            <option value="">{isLoadingPRs ? "Loading PRs..." : "Choose a pull request"}</option>
            {pullRequests.map((pr) => (
              <option key={pr.number} value={pr.number}>
                #{pr.number}: {pr.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button
        onClick={handleReview}
        disabled={!selectedPR || isLoading}
        className="w-full"
      >
        {isLoading ? "Reviewing..." : "Review Pull Request"}
      </Button>
    </div>
  );
}