'use client';

import React, { useId, useState } from 'react';
import QRCode from 'react-qr-code';
import { Copy, Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
  showDownload?: boolean;
  showCopy?: boolean;
}

function QRCodeGenerator({
  value,
  size = 256,
  level = 'M',
  className = '',
  showDownload = true,
  showCopy = true,
}: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const qrId = useId();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById(qrId);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'qr-code.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCode
          id={qrId}
          value={value}
          size={size}
          level={level}
        />
      </div>
      
      <div className="flex gap-2">
        {showCopy && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-[#4ebff7] hover:bg-[#52C1F0] text-white rounded-md transition-colors"
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        )}
        
        {showDownload && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        )}
      </div>
    </div>
  );
}

export default QRCodeGenerator;
export type { QRCodeGeneratorProps };