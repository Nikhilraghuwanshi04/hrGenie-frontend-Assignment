'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/hooks';

export const Navbar = () => {
    const { title } = useAppSelector((state) => state.document);

    return (
        <nav className="h-16 border-b flex items-center justify-between px-4 bg-white">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                    D
                </div>
                <div>
                    <h1 className="text-sm font-semibold">{title}</h1>
                    <div className="flex gap-2 text-xs text-gray-500">
                        <span>File</span>
                        <span>Edit</span>
                        <span>View</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">Share</Button>
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
};
