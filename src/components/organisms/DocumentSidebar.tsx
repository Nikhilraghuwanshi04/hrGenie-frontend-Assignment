import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Plus } from 'lucide-react';

export const DocumentSidebar = () => {
    // Mock documents for now
    const documents = [
        { id: '1', title: 'Project Requirements' },
        { id: '2', title: 'Meeting Notes' },
        { id: '3', title: 'Brainstorming' },
    ];

    return (
        <div className="w-64 border-r h-full flex flex-col bg-gray-50/50">
            <div className="p-4 border-b">
                <Button className="w-full gap-2" variant="outline">
                    <Plus size={16} />
                    New Document
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {documents.map((doc) => (
                        <Button
                            key={doc.id}
                            variant="ghost"
                            className="w-full justify-start gap-2 font-normal"
                        >
                            <FileText size={16} />
                            {doc.title}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
