// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file received' },
        { status: 400 }
      );
    }

    // Create unique file name
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename with original extension
    const originalFilename = file.name;
    const fileExtension = originalFilename.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Save to uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadsDir, uniqueFilename);
    
    await writeFile(filePath, buffer);
    
    // Return the URL that can be stored in MongoDB
    const fileUrl = `/uploads/${uniqueFilename}`;
    
    return NextResponse.json({ 
      success: true, 
      fileUrl,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}