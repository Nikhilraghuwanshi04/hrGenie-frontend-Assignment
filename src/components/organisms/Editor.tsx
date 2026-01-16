'use client';

import { useSocket } from '@/hooks/useSocket';
import { setContent } from '@/redux/features/document/documentSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import('react-quill-new');
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
}, { ssr: false });

export const Editor = () => {
    const dispatch = useAppDispatch();
    const { content, _id } = useAppSelector((state) => state.document);
    const { user } = useAppSelector((state) => state.auth);
    const [value, setValue] = useState(content);

    // Callback for incoming socket changes
    const onContentUpdate = useCallback((newContent: any) => {
        // Assuming backend sends full string content for now
        setValue(newContent);
        dispatch(setContent(newContent));
    }, [dispatch]);

    // Connect to socket
    const { sendChanges } = useSocket(_id || '', (user as any)?._id || user?.id || 'anon', onContentUpdate);

    useEffect(() => {
        setValue(content);
    }, [content]);

    const handleChange = (content: string, delta: any, source: string, editor: any) => {
        setValue(content);

        // Only emit changes if they come from the user to avoid loops
        if (source === 'user') {
            dispatch(setContent(content));
            // Emit changes via socket
            if (sendChanges) {
                sendChanges(content);
            }
        }
    };

    return (
        <div className="h-full w-full bg-gray-50/50 flex flex-col items-center overflow-y-auto relative">
            {/* Header / Toolbar Area could go here if separated, but Quill has its own */}

            <div className="flex-1 w-full flex justify-center p-8">
                <div className="bg-white shadow-sm border rounded-sm min-h-[800px] w-full max-w-[850px] relative">
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={handleChange}
                        className="h-full"
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
