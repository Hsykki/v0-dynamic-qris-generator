import { AnimatedBackground } from "@/components/animated-background"
import { ThemeToggle } from "@/components/theme-toggle"
import { QrisGenerator } from "@/components/qris-generator"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">QRIS Generator</h1>
              <p className="text-xs text-muted-foreground">Dynamic Payment QR Code</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Generate Dynamic QRIS
              <span className="text-primary"> Instantly</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Convert your static QRIS code into dynamic payment QR codes with custom amounts. Perfect for merchants and
              businesses.
            </p>
          </div>

          {/* Generator Component */}
          <QrisGenerator />

          {/* Info Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center space-y-2 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-foreground">Fast Generation</h3>
              <p className="text-sm text-muted-foreground">
                Generate dynamic QRIS codes in seconds with our optimized algorithm
              </p>
            </div>
            <div className="text-center space-y-2 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-foreground">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                CRC16 checksum validation ensures your QRIS codes are always valid
              </p>
            </div>
            <div className="text-center space-y-2 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-foreground">Mobile Ready</h3>
              <p className="text-sm text-muted-foreground">Download and share QR codes instantly on any device</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            Copyright 2025 By{" "}
            <a
              href="https://github.com/AmmarrBN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              AmmarBN
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}
