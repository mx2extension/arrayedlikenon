'use client';

import { QRCodeSVG } from 'qrcode.react';

interface GarmentQRCodeProps {
  token: string; // Cryptographic UUID from garment_authenticity table
  size?: number;
}

export default function GarmentQRCode({ token, size = 160 }: GarmentQRCodeProps) {
  // The exact public verification URL
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://arrayedlikenone.com'}/verify/${token}`;

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-[#f5f2ea] border border-black/10 text-center">
      <div className="p-2 bg-white border border-black/10">
        <QRCodeSVG
          value={verifyUrl}
          size={size}
          bgColor="#ffffff"
          fgColor="#151515"
          level="H" // High error correction (remains scannable even if slightly worn or small)
          includeMargin={false}
        />
      </div>
      <div className="text-[8px] tracking-[0.2em] uppercase opacity-60">
        Scan to Verify Originality
      </div>
    </div>
  );
}