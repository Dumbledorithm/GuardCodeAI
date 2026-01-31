# GuardCode AI : AI based Code reviewer
GuardCode AI is a developer-centric tool that goes beyond simple code reviews. By integrating directly with the GitHub API, it audits Pull Requests and random snippets while tracking a developer's code quality trends over time.

## Key Features
- ### GitHub PR Integration
  Connect your repositories to fetch and review open Pull Requests automatically using Octokit.
- ### Instant Sandbox Review
  A real-time interface to paste and audit arbitrary code snippets for quick logic checks.
- ### Quality Trend Analytics
  Visualizes progress over time with historical data.
- ### Inference at the Edge
  Powered by Groq API for near-instantaneous feedback (sub-1s response times).

## Tech Stack
- ### Framework
   Next.js 14
- ### Language
   TypeScript
- ### LLM Engine
   Groq API (Inference on LPU for speed)
- ### Database
   Firebase
- ### Styling
   Tailwind CSS

## How it Works
- ### Extraction
   The system pulls code changes from GitHub via the Octokit API
- ### Analysis
   Snippets are sent to the Groq-powered LLM with a specialized system prompt focusing on industry-standard "Clean Code" principles.
- ### Scoring
   The AI assigns a normalized score across 4 key dimensions.
- ### Trend Mapping
   The scores are saved to Firebase and mapped on a line chart to show if the developer's quality is improving or declining over a period of time.

## Setup and Installation
- ### 1. Clone the repository
   ```bash
   git clone https://github.com/your-username/GuardCodeAI.git
   ```

- ### 2. Install dependencies
  ```bash
  npm install
  ```
- ### 3. Environment Setup
  ```bash
  GROQ_API_KEY=
  GITHUB_CLIENT_ID=
  GITHUB_CLIENT_SECRET=
  NEXTAUTH_SECRET=
  FIREBASE_PROJECT_ID=
  FIREBASE_CLIENT_EMAIL=
  FIREBASE_PRIVATE_KEY=
  ```
- ### 4. Run the app
  ```bash
  npm run dev
  ```
  
