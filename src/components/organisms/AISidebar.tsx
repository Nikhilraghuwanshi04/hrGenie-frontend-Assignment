'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSelector } from '@/redux/hooks';
import { aiApi } from '@/services/api';
import { useState } from 'react';

export const AISidebar = () => {
    const { content } = useAppSelector((state) => state.document);
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            // Strip HTML tags from content for better AI processing
            const safeContent = content.replace(/<[^>]*>/g, '').trim();

            if (!safeContent) {
                setSuggestion("Please type some content in the document first.");
                return;
            }

            const response = await aiApi.summarize(safeContent);
            setSuggestion(response.data.summary || "No summary generated.");
        } catch (error) {
            console.error("Error calling AI API:", error);
            setSuggestion("Error generating suggestion.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-full w-[300px] border-l rounded-none flex flex-col">
            <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <ScrollArea className="flex-1 border rounded-md p-4">
                    {suggestion ? (
                        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {/* If the AI returns markdown or text, this is fine. If it returns HTML, we might need a parser. 
                                 For now, let's assume text/markdown. If we want to support bolding from AI: */}
                            {suggestion}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Click generate to get AI suggestions.</p>
                    )}
                </ScrollArea>
                <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? 'Thinking...' : 'Generate Suggestions'}
                </Button>
            </CardContent>
        </Card>
    );
};
