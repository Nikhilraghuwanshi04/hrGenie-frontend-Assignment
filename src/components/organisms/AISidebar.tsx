'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
import axios from 'axios';
import { Bot, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export const AISidebar = () => {
    const { content } = useAppSelector((state) => state.document);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Strip HTML tags for context, but keep it readable
            const safeContent = content.replace(/<[^>]*>/g, ' ').trim();

            const response = await axios.post('/api/chat', {
                messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
                context: safeContent
            });

            const aiMessage: Message = { role: 'assistant', content: response.data.reply };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error: any) {
            console.error("Error sending message:", error);
            const msg = error.response?.data?.error || "Sorry, I encountered an error. Please try again.";
            const errorMessage: Message = { role: 'assistant', content: msg };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Card className="h-full w-[350px] border-l rounded-none flex flex-col shadow-xl bg-gray-50/50">
            <CardHeader className="p-4 border-b bg-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="w-5 h-5 text-blue-600" />
                    AI Assistant
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-2 p-4">
                            <Bot className="w-12 h-12 text-gray-300" />
                            <p className="text-sm font-medium">How can I help you regarding this document?</p>
                            <p className="text-xs text-gray-400">Ask for summaries, improvements, or explanations.</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white border text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border text-gray-800 rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t">
                    <div className="relative">
                        <Input
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="pr-12 py-6 rounded-full border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                        />
                        <Button
                            size="icon"
                            className="absolute right-1 top-1 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-transform active:scale-95"
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
