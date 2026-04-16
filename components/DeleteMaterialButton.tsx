'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteMaterialButtonProps {
    id: string;
}

export default function DeleteMaterialButton({ id }: DeleteMaterialButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this material?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/materials/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete material');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting material');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-rose-600 transition-all disabled:opacity-50"
            title="Delete Material"
        >
            <Trash2 size={18} />
        </button>
    );
}
