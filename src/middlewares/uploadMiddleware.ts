import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import zlib from "zlib";
import { Request, Response, NextFunction } from "express"; // Import types from express

dotenv.config();

const s3 = new S3Client({
  region: process.env.S3_REGION || '',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
});

// Middleware to compress the file using zlib before uploading
const compressFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  const compressedStream = zlib.createGzip(); // Use Gzip for compression

  // Compress the file buffer
  req.file.stream = req.file.stream.pipe(compressedStream);

  next();
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req: Request, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file, cb) {
      cb(null, Date.now().toString()); 
    },
  }),
});

export { upload, compressFile };
