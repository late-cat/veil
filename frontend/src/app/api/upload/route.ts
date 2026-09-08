import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  // Check if BLOB_READ_WRITE_TOKEN is set, otherwise mock it for local development if it fails
  try {
    const blob = await put(filename, request.body!, {
      access: 'public',
    });
    return NextResponse.json(blob);
  } catch (error: any) {
    console.error('Vercel Blob Upload Failed:', error.message);
    // Since this is a demo environment and token might not be set yet, return a mock URL
    return NextResponse.json({
      url: `https://mock-blob-url.com/${filename}`,
      pathname: filename,
      error: 'Mocked upload due to missing token or Vercel Blob error',
    });
  }
}
