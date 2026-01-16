import { setActiveUsers } from '@/redux/features/document/documentSlice';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { socket } from '../services/socket';
export const useSocket = (documentId: string, userId: string, onContentUpdate?: (content: any) => void) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!documentId || !token) return;

        // Connect with auth
        socket.auth = { token };
        socket.connect();

        // Join
        socket.emit('join-document', documentId);

        // changes
        socket.on('receive-changes', (delta: any) => {
            if (onContentUpdate) {
                onContentUpdate(delta);
            }
        });

        // Presence
        socket.on('active-users', (users: string[]) => {
            dispatch(setActiveUsers(users));
        });

        // If backend sends cursor positions
        socket.on('receive-cursor', (range: any, userId: string) => {
            // console.log(`Cursor update from ${userId}`, range);
        });

        return () => {
            socket.off('receive-changes');
            socket.off('active-users');
            socket.off('receive-cursor');
            socket.emit('leave-document', documentId); // Optional if backend supports it
            socket.disconnect();
        };
    }, [documentId, userId, dispatch, token]); // Remove onContentUpdate from dependency to avoid reconnect loops if it's not stable

    // Helper functions to emit events
    const sendChanges = (delta: any) => {
        socket.emit('send-changes', delta, documentId);
        socket.emit('save-document', { documentId, content: delta }); // Or full content
    };

    const sendCursor = (range: any) => {
        socket.emit('cursor-changes', range, documentId);
    };

    return { socket, sendChanges, sendCursor };
};
