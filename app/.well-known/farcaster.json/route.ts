import { NextResponse } from 'next/server'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://slid.vercel.app'
  
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjQ2MTM4NCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDM5NjQ0MUIyMTM3MjVkMzljRTJiMjcwNzE5QzdjMDk2MmE0OUZmZWIifQ",
      payload: "eyJkb21haW4iOiJzbGlkLnZlcmNlbC5hcHAifQ",
      signature: "SztSAQcyyREo9nnJhJuYJZDVWaE0ft3kqT6wiDLdnQdasHBmO0pZv4bLG11aWrhWdA6kN92uwpGSX1dZr7skDhw="
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
