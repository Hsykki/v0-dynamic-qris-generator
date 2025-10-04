"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, QrCode, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"

export function QrisGenerator() {
  const [qrisStatic, setQrisStatic] = useState<string>("")
  const [nominal, setNominal] = useState<string>("")
  const [qrisDynamic, setQrisDynamic] = useState<string>("")
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const convertCrc16 = (data: string): string => {
    let crc = 0xffff
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021
        } else {
          crc <<= 1
        }
        crc &= 0xffff
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0")
  }

  const generateQris = (staticQris: string, amount: string): string => {
    let qris = staticQris.slice(0, -4)
    qris = qris.replace("010211", "010212")
    const parts = qris.split("5802ID")
    const amountTag = `54${amount.length.toString().padStart(2, "0")}${amount}5802ID`
    const result = parts[0] + amountTag + parts[1]
    return result + convertCrc16(result)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageData = event.target?.result as string

        // In a real implementation, you would use a QR code scanner library
        // For now, we'll show a message to manually input the QRIS code
        toast({
          title: "Image uploaded",
          description: "Please scan the QR code and paste the QRIS string below",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read image file",
        variant: "destructive",
      })
    }
  }

  const overlayLogoOnQR = async (qrDataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      const qrImage = new Image()
      qrImage.crossOrigin = "anonymous"
      qrImage.onload = () => {
        canvas.width = qrImage.width
        canvas.height = qrImage.height

        // Draw QR code
        ctx.drawImage(qrImage, 0, 0)

        // Load and draw logo
        const logo = new Image()
        logo.crossOrigin = "anonymous"
        logo.onload = () => {
          const logoSize = qrImage.width * 0.25 // Logo is 25% of QR code size
          const logoX = (qrImage.width - logoSize) / 2
          const logoY = (qrImage.height - logoSize) / 2

          // Draw white background circle for logo
          ctx.fillStyle = "white"
          ctx.beginPath()
          ctx.arc(qrImage.width / 2, qrImage.height / 2, logoSize / 2 + 10, 0, 2 * Math.PI)
          ctx.fill()

          // Draw logo
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)

          resolve(canvas.toDataURL("image/png"))
        }
        logo.onerror = () => {
          // If logo fails to load, return QR code without logo
          resolve(qrDataUrl)
        }
        logo.src = "/yuki-host-logo.jpeg"
      }
      qrImage.onerror = () => reject(new Error("Failed to load QR code image"))
      qrImage.src = qrDataUrl
    })
  }

  const handleGenerate = async () => {
    if (!qrisStatic) {
      toast({
        title: "Error",
        description: "Please provide QRIS static code",
        variant: "destructive",
      })
      return
    }

    if (!nominal || Number.parseFloat(nominal) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const dynamicQris = generateQris(qrisStatic, nominal)
      setQrisDynamic(dynamicQris)

      // Generate QR code
      const qrUrl = await QRCode.toDataURL(dynamicQris, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      const qrWithLogo = await overlayLogoOnQR(qrUrl)
      setQrCodeUrl(qrWithLogo)

      toast({
        title: "Success",
        description: "Dynamic QRIS generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QRIS",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qris_${nominal}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Downloaded",
      description: "QR code saved successfully",
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="text-2xl">Generate Dynamic QRIS</CardTitle>
          <CardDescription>Upload your static QRIS code and enter the payment amount</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="qris-upload">Upload QRIS Image (Optional)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                id="qris-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <p className="text-xs text-muted-foreground">Upload a QR code image to extract QRIS data</p>
          </div>

          {/* QRIS Static Input */}
          <div className="space-y-2">
            <Label htmlFor="qris-static">QRIS Static Code</Label>
            <textarea
              id="qris-static"
              className="w-full min-h-[120px] px-3 py-2 text-sm rounded-lg border border-input bg-background resize-none font-mono"
              placeholder="Paste your QRIS static code here..."
              value={qrisStatic}
              onChange={(e) => setQrisStatic(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">The complete QRIS string from your static QR code</p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="nominal">Payment Amount (IDR)</Label>
            <Input
              id="nominal"
              type="number"
              placeholder="50000"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">Enter the payment amount in Indonesian Rupiah</p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <QrCode className="mr-2 h-5 w-5" />
                Generate Dynamic QRIS
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="text-2xl">Generated QR Code</CardTitle>
          <CardDescription>Your dynamic QRIS code ready for payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {qrCodeUrl ? (
            <>
              {/* QR Code Display */}
              <div className="flex justify-center p-6 bg-background rounded-lg border-2 border-border">
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="Dynamic QRIS QR Code"
                  className="w-full max-w-[300px] h-auto"
                />
              </div>

              {/* Amount Display */}
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Payment Amount</p>
                <p className="text-3xl font-bold text-primary">
                  Rp {Number.parseFloat(nominal).toLocaleString("id-ID")}
                </p>
              </div>

              {/* QRIS String */}
              <div className="space-y-2">
                <Label>Dynamic QRIS Code</Label>
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <p className="text-xs font-mono break-all text-muted-foreground">{qrisDynamic}</p>
                </div>
              </div>

              {/* Download Button */}
              <Button onClick={handleDownload} variant="outline" className="w-full bg-transparent" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download QR Code
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <QrCode className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">No QR Code Generated</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Enter your QRIS static code and payment amount, then click generate to create your dynamic QRIS
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
