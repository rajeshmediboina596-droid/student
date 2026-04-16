import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'teacher') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const relativePath = `materials/${filename}`;
        const uploadDir = path.join(process.cwd(), 'public', 'materials');
        
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // ignore error if directory already exists
        }
        
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const material = await db.material.create({
            data: {
                title: file.name,
                description: '',
                fileUrl: `/${relativePath}`,
                uploadedBy: session.user.id
            }
        });

        return NextResponse.json({ success: true, material });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
