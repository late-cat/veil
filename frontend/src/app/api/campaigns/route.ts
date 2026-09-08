import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'campaigns.json');

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
  const campaignId = searchParams.get('id');
  
  if (!campaignId) {
    const campaigns = readDB();
    return NextResponse.json({ campaigns });
  }

  const campaigns = readDB();
  const campaign = campaigns.find((c: any) => c.id === campaignId);
  
  if (campaign) {
    return NextResponse.json({ found: true, campaign });
  }
  return NextResponse.json({ found: false }, { status: 404 });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const campaigns = readDB();
    
    // Generate a unique Campaign ID
    const campaignId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const newCampaign = {
      id: campaignId,
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    campaigns.push(newCampaign);
    writeDB(campaigns);
    
    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create campaign' }, { status: 500 });
  }
}
