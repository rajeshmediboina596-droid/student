'use client';

import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadMaterialButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/materials/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Upload error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
            >
                <Upload size={20} />
                {isUploading ? 'Uploading...' : 'Upload New File'}
            </button>
        </div>
    );
}
