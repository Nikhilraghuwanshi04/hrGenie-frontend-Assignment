'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from '@/redux/features/document/documentSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { socket } from '@/services/socket';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    MoreHorizontal,
    Pencil,
    Plus,
    Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const DocumentSidebar = () => {
    const dispatch = useAppDispatch();
    const { documents, _id } = useAppSelector((state) => state.document);
    const { user } = useAppSelector((state) => state.auth);
    const [collapsed, setCollapsed] = useState(false);

    // Dialog States
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [renameDoc, setRenameDoc] = useState<{ id: string, title: string } | null>(null);
    const [newTitle, setNewTitle] = useState("");

    useEffect(() => {
        dispatch(getAllDocuments());

        // Listen for global document updates
        socket.on('documents-updated', () => {
            dispatch(getAllDocuments());
        });

        return () => {
            socket.off('documents-updated');
        };
    }, [dispatch]);

    const handleCreate = async () => {
        const title = "Untitled Document";
        const result = await dispatch(createDocument(title));
        if (createDocument.fulfilled.match(result)) {
            const newDocId = result.payload._id;
            dispatch(getDocument(newDocId));
        }
        dispatch(getAllDocuments());
        socket.emit('documents-updated');
    };

    const handleSelect = (id: string) => {
        dispatch(getDocument(id));
    };

    const confirmDelete = (e: React.MouseEvent, doc: any) => {
        e.stopPropagation();
        setDeleteId(doc._id || doc.id);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await dispatch(deleteDocument(deleteId));
            socket.emit('documents-updated');
            setDeleteId(null);
        }
    };

    const startRename = (e: React.MouseEvent, doc: any) => {
        e.stopPropagation();
        setRenameDoc({ id: doc._id || doc.id, title: doc.title });
        setNewTitle(doc.title);
    };

    const handleRename = async () => {
        if (renameDoc && newTitle.trim() && newTitle !== renameDoc.title) {
            await dispatch(updateDocument({ id: renameDoc.id, title: newTitle }));
            socket.emit('documents-updated');
        }
        setRenameDoc(null);
    };

    return (
        <>
            <motion.aside
                animate={{ width: collapsed ? 60 : 260 }}
                className="border-r bg-muted/30 flex flex-col h-[calc(100vh-4rem)] relative group"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-md z-10 hidden group-hover:flex"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </Button>

                <div className="p-4 border-b flex justify-center">
                    <Button onClick={handleCreate} className={cn("gap-2", collapsed ? "px-2" : "w-full")}>
                        <Plus className="h-4 w-4" />
                        {!collapsed && "New Document"}
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {/* Show all documents returned by the backend, just filter valid ones */}
                        {documents?.filter((doc: any) => doc._id).map((doc) => {
                            const userId = (user as any)?._id || user?.id;
                            const docOwner = (doc as any).owner;
                            const ownerId = (typeof docOwner === 'object' && docOwner) ? docOwner._id : docOwner;
                            const isOwner = !ownerId || !userId || ownerId === userId;

                            return (
                                <div
                                    key={doc._id}
                                    onClick={() => handleSelect(doc._id)}
                                    className={cn(
                                        "flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors group/item relative",
                                        doc._id === _id ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <FileText className="h-4 w-4 shrink-0" />

                                    {!collapsed && (
                                        <>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-medium truncate">
                                                    {doc.title || 'Untitled'}
                                                </p>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <MoreHorizontal size={14} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => startRename(e, doc)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={(e) => confirmDelete(e, doc)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </motion.aside>

            {/* Rename Dialog */}
            <Dialog open={!!renameDoc} onOpenChange={(open) => !open && setRenameDoc(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Document</DialogTitle>
                        <DialogDescription>
                            Enter a new title for your document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="name"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="col-span-3"
                                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRenameDoc(null)}>Cancel</Button>
                        <Button onClick={handleRename}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this document? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
