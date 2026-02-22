import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Handle Farcaster frame webhooks
    // Events: frame_added, frame_removed, notifications_enabled, notifications_disabled
    console.log('Farcaster webhook:', body)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
