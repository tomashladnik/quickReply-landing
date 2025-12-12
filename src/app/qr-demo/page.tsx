'use client';

import React, { useState } from 'react';
import QRCodeGenerator from '@/components/ui/QRCodeGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode as QrCodeIcon, Link } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function QRCodeDemoPage() {
  const [qrValue, setQrValue] = useState('https://example.com');
  const [generatedQRs, setGeneratedQRs] = useState<Array<{ url: string; timestamp: Date }>>([]);
  const [scanId, setScanId] = useState('');
  const [flowType, setFlowType] = useState<'gym' | 'school' | 'charity'>('gym');
  const [multiUseQR, setMultiUseQR] = useState<string | null>(null);

  // Multi-use case QR generation
  const generateScanId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${flowType}-${timestamp}-${random}`;
  };

  // Generate unique scan ID when component mounts or flow type changes
  React.useEffect(() => {
    const generateUniqueScanId = () => {
      const newScanId = generateScanId();
      setScanId(newScanId);
    };
    
    generateUniqueScanId();
  }, [flowType]);

  const handleGenerateMultiUseQR = async () => {
    try {
      const response = await fetch('/api/qr-code/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanId,
          flowType,
          multiUse: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setMultiUseQR(data.url);
      setGeneratedQRs((prev) => [{ url: data.url, timestamp: new Date() }, ...prev]);
    } catch (error) {
      console.error('Error generating multi-use QR:', error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <QrCodeIcon className="w-10 h-10 text-[#4ebff7]" />
            QR Code Generator
          </h1>
          <p className="text-gray-600">
            Generate QR codes for multi-use case dental scanning workflows
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="simple" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">Simple QR Code</TabsTrigger>
            <TabsTrigger value="multiuse">Multi-Use QR Code</TabsTrigger>
          </TabsList>

          {/* Simple QR Code Tab */}
          <TabsContent value="simple" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Simple QR Code</CardTitle>
                <CardDescription>
                  Create a basic QR code from any URL or text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="qr-url">URL or Text</Label>
                  <Input
                    id="qr-url"
                    type="text"
                    placeholder="https://example.com"
                    value={qrValue}
                    onChange={(e) => setQrValue(e.target.value)}
                    className="font-mono"
                  />
                </div>

                {qrValue && (
                  <div className="flex justify-center">
                    <QRCodeGenerator 
                      value={qrValue} 
                      size={256}
                      level="M"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multi-Use QR Code Tab */}
          <TabsContent value="multiuse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Multi-Use QR Code</CardTitle>
                <CardDescription>
                  Create a QR code that routes to different flows: QR → Capture Images → ML Output → Results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Flow Type Selection */}
                <div className="space-y-2">
                  <Label>Select Flow Type</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['gym', 'school', 'charity'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFlowType(type)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          flowType === type
                            ? 'border-[#4ebff7] bg-[#4ebff7]/10'
                            : 'border-gray-200 hover:border-[#4ebff7]/50'
                        }`}
                      >
                        <div className="text-lg font-semibold capitalize">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scan ID Display */}
                <div className="space-y-2">
                  <Label htmlFor="scan-id">Scan ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="scan-id"
                      type="text"
                      value={scanId}
                      onChange={(e) => setScanId(e.target.value)}
                      className="font-mono"
                    />
                    <Button
                      onClick={() => setScanId(generateScanId())}
                      variant="outline"
                    >
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Unique identifier for tracking this scan session
                  </p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateMultiUseQR}
                  className="w-full bg-[#4ebff7] hover:bg-[#52C1F0]"
                  size="lg"
                >
                  <QrCodeIcon className="mr-2 w-5 h-5" />
                  Generate Multi-Use QR Code
                </Button>

                {/* Generated QR Code Display */}
                {multiUseQR && (
                  <div className="space-y-4 pt-6 border-t">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-4">Your Multi-Use QR Code</h3>
                      <QRCodeGenerator 
                        value={multiUseQR}
                        size={256}
                        level="H"
                      />
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 font-mono break-all">
                          {multiUseQR}
                        </p>
                      </div>
                    </div>

                    {/* Flow Information */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          Expected Flow
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>User scans QR code</li>
                          <li>Redirects to capture images page</li>
                          <li>Images processed by ML model</li>
                          <li>Results displayed on results card</li>
                        </ol>
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <p className="text-xs text-gray-600">
                            <strong>Flow Type:</strong> {flowType.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-600">
                            <strong>Scan ID:</strong> {scanId}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent QR Codes */}
            {generatedQRs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recently Generated QR Codes</CardTitle>
                  <CardDescription>
                    Your recent QR code generations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedQRs.map((qr, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono truncate">{qr.url}</p>
                          <p className="text-xs text-gray-500">
                            {qr.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMultiUseQR(qr.url)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
