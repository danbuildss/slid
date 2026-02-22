import { NextResponse } from 'next/server'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://slid.vercel.app'
  
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjEyMzQ1NiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQ",
      payload: "eyJkb21haW4iOiJzbGlkLnZlcmNlbC5hcHAifQ",
      signature: "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw"
    },
    frame: {
      version: "1",
      name: "Slid",
      iconUrl: `${appUrl}/logo-polished.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og-image.png`,
      buttonTitle: "Open Slid",
      splashImageUrl: `${appUrl}/logo-polished.png`,
      splashBackgroundColor: "#0A0A0B",
      webhookUrl: `${appUrl}/api/webhook`
    }
  }

  return NextResponse.json(manifest)
}
