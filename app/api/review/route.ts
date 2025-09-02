import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }
    
    // Construct the prompt for the AI
    const systemPrompt = `You are an expert code reviewer. Provide a detailed, constructive, and friendly review of the following ${language} code. Focus on best practices, potential bugs, and areas for improvement. Use markdown for formatting, including code blocks for suggestions.`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: `Here is the code to review:\n\n\`\`\`${language}\n${code}\n\`\`\``,
            }
        ],
        // FIX: Updated the model to a currently supported version.
        model: "llama-3.1-8b-instant", 
    });

    const reviewText = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a review.";

    return NextResponse.json({ review: reviewText });

  } catch (error) {
    console.error('Error in Groq review API:', error);
    return NextResponse.json({ error: 'Failed to process code review with Groq.' }, { status: 500 });
  }
}

