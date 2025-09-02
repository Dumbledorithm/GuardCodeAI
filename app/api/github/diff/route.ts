// File: app/api/github/diff/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse, NextRequest } from "next/server";
import { Octokit } from "@octokit/rest";

export async function GET(req: NextRequest) {
  const session: any = await getServerSession(authOptions);
  
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const pull_number = searchParams.get('pull_number');

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!owner || !repo || !pull_number) {
    return NextResponse.json({ error: "Owner, repo, and pull_number are required" }, { status: 400 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // 1. Request a specific pull request.
    const response = await octokit.pulls.get({
      owner,
      repo,
      pull_number: parseInt(pull_number, 10),
      // 2. This is the crucial part: we specify that we want the response in 'diff' format.
      mediaType: {
        format: 'diff'
      }
    });
    
    // 3. The diff content is the direct response, so we return it as plain text.
    return new Response(response.data as any, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error("Error fetching diff:", error);
    return NextResponse.json({ error: "Failed to fetch diff" }, { status: 500 });
  }
}