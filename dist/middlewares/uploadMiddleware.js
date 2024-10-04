"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.S3_REGION || '',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});
exports.default = upload;
// import { S3Client } from "@aws-sdk/client-s3"
// import multer from "multer"
// import multerS3 from "multer-s3"
// import dotenv from 'dotenv'
// import path from 'path'
// dotenv.config()
// const s3 = new S3Client({
//   region: process.env.S3_REGION || '',
//   credentials: {
//     accessKeyId: process.env.S3_ACCESS_KEY || '',
//     secretAccessKey: process.env.S3_SECRET_KEY || '',
//   },
// });
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET as string,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       const fileExtension = path.extname(file.originalname).toLowerCase();
//       let folder = '';
//       if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
//         folder = 'images/';
//       } else if (['.mp3', '.wav', '.ogg', '.webm'].includes(fileExtension)) {
//         folder = 'audio/';
//       } else {
//         return cb(new Error('Invalid file type'), '');
//       }
//       cb(null, folder + Date.now().toString() + fileExtension);
//     }
//   }),
//   fileFilter: (req, file, cb) => {
//     const allowedMimes = [
//       'image/jpeg',
//       'image/png',
//       'image/gif',
//       'audio/mpeg',
//       'audio/wav',
//       'audio/ogg',
//       'audio/webm'
//     ];
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type'));
//     }
//   },
//   limits: {
//     fileSize: 10 * 1024 * 1024, 
//   }
// })
// export default upload
