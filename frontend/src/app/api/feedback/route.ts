import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'feedback.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data: any[]) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proofId = searchParams.get('proofId');
  const campaignId = searchParams.get('campaignId');
  
  if (campaignId) {
    const records = readDB().filter((r: any) => r.campaignId === campaignId);
    return NextResponse.json({ count: records.length, records });
  }

  if (!proofId) {
    const records = readDB();
    return NextResponse.json({ count: records.length, records });
  }

  const records = readDB();
  const record = records.find((r: any) => r.proofId === proofId);
  
  if (record) {
    return NextResponse.json({ found: true, record });
  }
  return NextResponse.json({ found: false });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const records = readDB();
    
    const proofId = 'VF-' + Math.random().toString(16).substring(2, 9).toUpperCase();
    
    records.push({
      ...data,
      proofId,
      timestamp: new Date().toISOString(),
      status: 'VERIFIED'
    });
    
    writeDB(records);
    
    return NextResponse.json({ success: true, proofId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to store feedback' }, { status: 500 });
  }
}
