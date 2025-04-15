import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const config = {
  api: { bodyParser: false }
};

interface UploadResponse {
  success: boolean;
  url?: string;
  originalName?: string;
  size?: number;
  type?: string;
  message?: string;
}

const uploadToCloudinary = (file: formidable.File, userId?: string): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.filepath,
      {
        resource_type: 'auto',
        folder: 'InsureEase/documents',
        public_id: `${userId || 'anonymous'}_${Date.now()}_${file.originalFilename?.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
        } else {
          resolve(result as unknown as CloudinaryUploadResult);
        }
      }
    );
  });
};

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  original_filename?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UploadResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
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
    const userId = fields.userId?.[0] || 'anonymous';

    // Upload to Cloudinary instead of local directory
    const cloudinaryResult = await uploadToCloudinary(uploadedFile, userId);

    return res.status(200).json({
      success: true,
      url: cloudinaryResult.secure_url,
      originalName: uploadedFile.originalFilename || cloudinaryResult.original_filename,
      size: cloudinaryResult.bytes,
      type: cloudinaryResult.format
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