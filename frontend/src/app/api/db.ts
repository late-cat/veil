import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

/**
 * Universal JSON Database utility for Vercel Serverless & Local Dev.
 * Uses @vercel/blob if BLOB_READ_WRITE_TOKEN is present.
 * Falls back to local filesystem in development.
 */

// We store the blobs at the root of the vercel blob bucket, or local /data dir.
function getLocalPath(filename: string) {
  return path.join(process.cwd(), 'data', filename);
}

export async function readDB(filename: string): Promise<any[]> {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Find the blob by searching for the filename
      const { list } = await import('@vercel/blob');
      const { blobs } = await list({ prefix: filename });
      const blob = blobs.find((b) => b.pathname === filename);
      
      if (!blob) return [];
      
      const res = await fetch(blob.url);
      if (!res.ok) return [];
      return await res.json();
    }
  } catch (err: any) {
    console.warn(`[VEIL DB] Vercel Blob read failed, falling back to local FS: ${err.message}`);
  }

  // Fallback to Local FS
  const localPath = getLocalPath(filename);
  if (!fs.existsSync(localPath)) return [];
  return JSON.parse(fs.readFileSync(localPath, 'utf8'));
}

export async function writeDB(filename: string, data: any[]): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await put(filename, jsonString, {
        access: 'public',
        addRandomSuffix: false, // overwrite the same file
        allowOverwrite: true
      });
      return;
    }
  } catch (err: any) {
    console.warn(`[VEIL DB] Vercel Blob write failed, falling back to local FS: ${err.message}`);
  }

  // Fallback to Local FS
  const localPath = getLocalPath(filename);
  const dir = path.dirname(localPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(localPath, jsonString);
}
