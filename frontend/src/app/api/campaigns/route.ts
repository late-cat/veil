import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('id');
  
  const campaigns = await readDB('campaigns.json');
  const feedback = await readDB('feedback.json');

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
    const campaigns = await readDB('campaigns.json');
    
    // Generate a unique Campaign ID
    const campaignId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const newCampaign = {
      id: campaignId,
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    campaigns.push(newCampaign);
    await writeDB('campaigns.json', campaigns);
    
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

    const campaigns = await readDB('campaigns.json');
    const updatedCampaigns = campaigns.filter((c: any) => c.id !== campaignId);
    
    if (campaigns.length === updatedCampaigns.length) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }

    await writeDB('campaigns.json', updatedCampaigns);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete campaign' }, { status: 500 });
  }
}
