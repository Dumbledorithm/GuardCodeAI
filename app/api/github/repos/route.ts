// File: app/api/github/repos/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function GET() {
  // 1. Get the user's session from NextAuth. This is secure and happens on the server.
  const session: any = await getServerSession(authOptions);

  // 2. If there's no session or access token, the user is not authenticated.
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 3. Initialize the Octokit client with the user's access token.
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // 4. Fetch the list of repositories for the authenticated user.
    const repos = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated', // Sort by most recently updated
      per_page: 50,     // Get up to 50 repos
    });
    
    // 5. Simplify the data to send only what the frontend needs (name and owner).
    const repoData = repos.data.map(repo => ({
      name: repo.name,
      owner: repo.owner.login,
    }));

    // 6. Send the simplified repository data back to the frontend.
    return NextResponse.json(repoData);
  } catch (error) {
    console.error("Error fetching repos:", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}