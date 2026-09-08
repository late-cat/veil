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
  
  const campaigns = readDB();
  const feedbackPath = path.join(process.cwd(), 'data', 'feedback.json');
  let feedback = [];
  if (fs.existsSync(feedbackPath)) {
    feedback = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
  }

  if (!campaignId) {
    // Attach response count to all campaigns
    const enrichedCampaigns = campaigns.map((c: any) => ({
      ...c,
      responseCount: feedback.filter((f: any) => f.campaignId === c.id).length
    }));
    return NextResponse.json({ campaigns: enrichedCampaigns, success: true });
  }

  const campaign = campaigns.find((c: any) => c.id === campaignId);
  
  if (campaign) {
    campaign.responseCount = feedback.filter((f: any) => f.campaignId === campaign.id).length;
    return NextResponse.json({ found: true, campaign, success: true });
  }
  return NextResponse.json({ found: false, success: false }, { status: 404 });
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('id');

    if (!campaignId) {
      return NextResponse.json({ success: false, error: 'Campaign ID required' }, { status: 400 });
    }

    const campaigns = readDB();
    const updatedCampaigns = campaigns.filter((c: any) => c.id !== campaignId);
    
    if (campaigns.length === updatedCampaigns.length) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }

    writeDB(updatedCampaigns);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete campaign' }, { status: 500 });
  }
}
