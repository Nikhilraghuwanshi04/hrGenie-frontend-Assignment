import { useEffect } from 'react';
import { setCollaborators, setContent } from '../redux/features/document/documentSlice';
import { useAppDispatch } from '../redux/hooks';
import { socket } from '../services/socket';

export const useSocket = (documentId: string) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Connect to socket
        socket.connect();

        // Join document room
        socket.emit('join-document', documentId);

        // Listen for incoming changes
        socket.on('receive-changes', (delta: any) => {
            // For simple text, we might receive full content or delta. 
            // Assuming full content for simplicity or delta handling in editor
            // This is a placeholder for delta handling
            // dispatch(setContent(delta)); 
        });

        socket.on('receive-content', (content: string) => {
            dispatch(setContent(content));
        });

        socket.on('collaborators-update', (users: string[]) => {
            dispatch(setCollaborators(users));
        });

        return () => {
            socket.off('receive-changes');
            socket.off('receive-content');
            socket.off('collaborators-update');
            socket.emit('leave-document', documentId);
            socket.disconnect();
        };
    }, [documentId, dispatch]);

    return socket;
};
