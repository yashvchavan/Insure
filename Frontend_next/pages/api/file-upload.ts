// app/api/file-upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { stat } from 'fs/promises';

// Configurable constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file received' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
        },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const originalFilename = file.name;
    const fileExtension = originalFilename.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await stat(uploadsDir);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        await mkdir(uploadsDir, { recursive: true });
      } else {
        throw err;
      }
    }

    // Save file
    const filePath = join(uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Return response
    const fileUrl = `/uploads/${uniqueFilename}`;
    
    return NextResponse.json({ 
      success: true, 
      fileUrl,
      originalFilename,
      fileSize: file.size,
      fileType: file.type,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}