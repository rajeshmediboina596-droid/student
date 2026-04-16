import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function DELETE(
    request: Request,
    context: any
) {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'teacher') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const materialId = (await context.params).id;

        // Try to fetch material to delete file from disk
        try {
            const material = await db.material.findUnique({
                where: { id: materialId },
            });
            
            if (material) {
                // If this file points to public/uploads, try to remove it
                if (material.fileUrl.startsWith('/uploads/')) {
                    const filePath = path.join(process.cwd(), 'public', material.fileUrl);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
        } catch (e) {
            console.error('Error deleting file from disk', e);
        }

        // Delete from database
        await db.material.delete({
            where: {
                id: materialId,
            },
        });

        revalidatePath('/dashboard/teacher/materials');
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting material:', error);
        return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
    }
}
