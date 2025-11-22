import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getSystemPrompt = (isDiff: boolean) => {
    const explanationInstruction = `
When you identify a specific, explainable concept (like a security vulnerability, a design pattern, a performance issue, or a core programming principle),
you MUST add a special tag immediately after it. The tag format is [EXPLAIN:TOPIC], where TOPIC is a concise,
machine-readable identifier using underscores (e.g., [EXPLAIN:CROSS_SITE_SCRIPTING], [EXPLAIN:BIG_O_NOTATION], [EXPLAIN:REACT_MEMOIZATION]).
This is a critical instruction for enabling the interactive learning feature of the application.`;

    const baseFormat = `Respond with ONLY a JSON object in the following format:
{
  "reviewText": "Your detailed, markdown-formatted review goes here.",
  "qualityScore": <A numerical score from 0 to 100 representing the quality of the code.>
}`;

    if (isDiff) {
        return `You are an expert code reviewer specializing in pull request diffs.
Analyze ONLY the added lines of code.
Focus on bugs, style, and best practices.
${explanationInstruction}
${baseFormat}`;
    } else {
        return `You are an expert code reviewer for code snippets.
Provide a detailed review of the entire snippet.
Focus on bugs, style, security, and best practices.
${explanationInstruction}
${baseFormat}`;
    }
}

// The rest of the file (the POST function) remains exactly the same.
export async function POST(req: NextRequest) {
  try {
    const { code, language, isDiff } = await req.json();
    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }
    
    const systemPrompt = getSystemPrompt(isDiff);
    const userInput = isDiff 
        ? `Please review this ${language} diff:\n\`\`\`diff\n${code}\n\`\`\``
        : `Please review this ${language} code snippet:\n\`\`\`${language}\n${code}\n\`\`\``;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userInput }
        ],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) throw new Error("Empty response from AI.");

    const parsedResponse = JSON.parse(responseContent);
    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error in Groq review API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: { message: `Failed to process review: ${errorMessage}` } }, { status: 500 });
  }
}

