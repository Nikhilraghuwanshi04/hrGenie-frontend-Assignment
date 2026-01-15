'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSelector } from '@/redux/hooks';
import { useState } from 'react';

export const AISidebar = () => {
    const { content } = useAppSelector((state) => state.document);
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        // Mock API call to Gemini
        setTimeout(() => {
            setSuggestion(`Here is a suggestion based on your content: "${content.slice(0, 20)}..."\n\nTry adding more details about the project requirements.`);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Card className="h-full w-[300px] border-l rounded-none flex flex-col">
            <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <ScrollArea className="flex-1 border rounded-md p-4">
                    {suggestion ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion}</p>
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
