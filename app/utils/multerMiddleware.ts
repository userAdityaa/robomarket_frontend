// First, create a middleware utility file: utils/multerMiddleware.ts
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import crypto from 'crypto';

// Custom type for extended request with file
export interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File;
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public/uploads'));
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only specific image types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'));
      return;
    }
    cb(null, true);
  },
});

// Middleware wrapper for error handling
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}