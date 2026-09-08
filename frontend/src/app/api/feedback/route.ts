import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // In a real Level 4+ app, this would use @vercel/postgres
    // For this MVP, we store the encrypted/private feedback locally to prove the concept works
    const dbPath = path.join(process.cwd(), 'data', 'feedback.json');
    
    let existingData = [];
    if (fs.existsSync(dbPath)) {
      existingData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    
    existingData.push({
      ...data,
      timestamp: new Date().toISOString(),
      status: 'VERIFIED'
    });
    
    fs.writeFileSync(dbPath, JSON.stringify(existingData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to store feedback' }, { status: 500 });
  }
}
