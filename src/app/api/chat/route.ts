
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, context } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        const systemMessage = {
            role: 'system',
            content: `You are a helpful AI assistant embedded in a document editor.
      The user is writing a document. You have access to the current content of the document.
      
      Start of Document Content:
      ${context || '(Empty Document)'}
      End of Document Content
      
      Answer the user's questions based on the document content or provide general writing assistance.
      Be concise, professional, and helpful. Format your responses using Markdown where appropriate.`
        };

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [systemMessage, ...messages],
        });

        const reply = completion.choices[0].message.content;

        return NextResponse.json({ reply });
    } catch (error: unknown) {
        console.error('Error in chat API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error processing request';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
