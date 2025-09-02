// File: app/api/github/prs/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse, NextRequest } from "next/server";
import { Octokit } from "@octokit/rest";

export async function GET(req: NextRequest) {
  const session: any = await getServerSession(authOptions);
  
  // 1. Get the 'owner' and 'repo' from the request URL's query parameters.
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  // 2. Ensure the required parameters were provided.
  if (!owner || !repo) {
    return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // 3. Fetch the list of open pull requests for the specified repository.
    const prs = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
    });
    
    // 4. Simplify the data to send only the PR number and title.
    const prData = prs.data.map(pr => ({
      number: pr.number,
      title: pr.title,
    }));

    // 5. Send the PR data back to the frontend.
    return NextResponse.json(prData);
  } catch (error) {
    console.error("Error fetching PRs:", error);
    return NextResponse.json({ error: "Failed to fetch pull requests" }, { status: 500 });
  }
}