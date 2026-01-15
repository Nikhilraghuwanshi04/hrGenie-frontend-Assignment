'use client';

import { setContent } from '@/redux/features/document/documentSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import('react-quill-new');
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
}, { ssr: false });

export const Editor = () => {
    const dispatch = useAppDispatch();
    const { content } = useAppSelector((state) => state.document);
    const [value, setValue] = useState(content);

    useEffect(() => {
        setValue(content);
    }, [content]);

    const handleChange = (content: string) => {
        setValue(content);
        // Debounce this dispatch in production
        dispatch(setContent(content));
        // Emit socket event here
    };

    return (
        <div className="h-full w-full">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={handleChange}
                className="h-[calc(100vh-150px)]"
            />
        </div>
    );
};
