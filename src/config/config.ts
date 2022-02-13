import dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 8000;
export const JWT_SECRET = process.env.JWT_SECRET || 'ES2USMdGFxZ3MuLNQrb9';
export const MASTER_SECRET = process.env.MASTER_SECRET || 'bbapi';
export const MONGO_HOST = `${process.env.MONGO_HOST}` || 'mongodb://localhost/bbapi';
export const ALLOWED_IP = `${process.env.ALLOWED_IP}` || 'http://localhost';
