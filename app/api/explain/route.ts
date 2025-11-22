import {NextRequest, NextResponse} from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `You are a world-class computer science professor and technical writer, skilled at making complex topics simple.
The user will provide a technical TOPIC.
Your task is to explain this topic in a clear, concise, and easy-to-understand manner for a software developer.
Structure your response using markdown.
1.  Start with a simple, one-sentence definition.
2.  Provide a short, practical code example in a relevant language to illustrate the concept.
3.  Finally, explain in a short paragraph why this concept is important or what problem it solves.
Do not use jargon without explaining it.`;

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }
    
    // Replace underscores with spaces for a more natural prompt
    const userPrompt = `Explain the following topic: ${topic.replace(/_/g, ' ')}`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "gemma-7b-it",
    });

    const explanation = chatCompletion.choices[0]?.message?.content;
    if (!explanation) {
        throw new Error("Empty response from AI.");
    }
    
    return NextResponse.json({ explanation });

  } catch (error) {
    console.error('Error in explain API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: { message: `Failed to get explanation: ${errorMessage}` } }, { status: 500 });
  }
}