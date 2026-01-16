'use client';

import { PresenceIndicator } from '@/components/molecules/PresenceIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { logout } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { LogOut } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { updateDocument } from '@/redux/features/document/documentSlice';
import { socket } from '@/services/socket';
import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check, Copy } from "lucide-react";

export const Navbar = () => {
    const dispatch = useAppDispatch();
    const { title, activeUsers, _id } = useAppSelector((state) => state.document);
    const { user } = useAppSelector((state) => state.auth);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);

    // Share Dialog State
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        setTempTitle(title);
    }, [title]);

    const handleTitleSave = async () => {
        if (tempTitle.trim() && tempTitle !== title && _id) {
            await dispatch(updateDocument({ id: _id, title: tempTitle }));
            socket.emit('documents-updated');
        }
        setIsEditingTitle(false);
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Provide default fallback to avoid crash if user is null
    const currentUser = user || { username: 'Guest', email: '' };

    const getInitials = (name?: string) => {
        if (!name) return 'GU';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 flex items-center px-4 justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <span className="font-bold text-primary">DocDocs</span>
                </div>
                <div className="h-6 w-[1px] bg-border mx-2" />

                {isEditingTitle ? (
                    <Input
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                        className="h-8 w-48 font-medium"
                        autoFocus
                    />
                ) : (
                    <h1
                        className="text-sm font-medium cursor-pointer hover:bg-accent px-2 py-1 rounded transition-colors"
                        onClick={() => setIsEditingTitle(true)}
                    >
                        {title || 'Untitled Document'}
                    </h1>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="mr-4">
                    <PresenceIndicator />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsShareOpen(true)}
                    >
                        Share
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} />
                                    <AvatarFallback>{getInitials(currentUser.username)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{currentUser.username}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {currentUser.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => dispatch(logout())}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Share Dialog */}
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share Document</DialogTitle>
                        <DialogDescription>
                            Anyone with this link can view and edit this document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="link"
                                defaultValue={typeof window !== 'undefined' ? window.location.href : ''}
                                readOnly
                            />
                        </div>
                        <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
                            <span className="sr-only">Copy</span>
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsShareOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </nav>
    );
};
