import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: MAX_SIZE,
      multiples: false,
      keepExtensions: true
    });

    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file;
    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file was uploaded' 
      });
    }

    const uploadedFile = Array.isArray(file) ? file[0] : file;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const newFilename = `${uuidv4()}.${uploadedFile.originalFilename?.split('.').pop() || ''}`;
    const newPath = join(uploadDir, newFilename);

    await fs.rename(uploadedFile.filepath, newPath);

    return res.status(200).json({
      success: true,
      url: `/uploads/${newFilename}`,
      originalName: uploadedFile.originalFilename,
      size: uploadedFile.size,
      type: uploadedFile.mimetype
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message.includes('maxFileSize') ? 
        `File exceeds ${MAX_SIZE/1024/1024}MB limit` : 
        'File upload failed'
    });
  }
}