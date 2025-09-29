import { FaucetForm } from "@/components/faucet-form"
import { Coins } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Coins className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Hedera USDC Faucet</h1>
              <p className="text-xs text-muted-foreground">Testnet Only</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-sm font-medium">Testnet Active</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold tracking-tight text-balance">Get Test USDC Tokens</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Request free USDC tokens on Hedera Testnet for development and testing purposes. Limited to 100 USDC per
              request.
            </p>
          </div>

          <FaucetForm />

          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold">How to Use</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Enter your Hedera testnet account ID (format: 0.0.xxxxx)</li>
              <li>Click "Request USDC" to receive 100 test USDC tokens</li>
              <li>Wait for the transaction to complete (usually takes a few seconds)</li>
              <li>Check your wallet balance to confirm receipt</li>
            </ol>
            <div className="mt-4 rounded-md bg-muted p-4">
              <p className="text-sm font-medium">Need a testnet account?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Visit the{" "}
                <a
                  href="https://portal.hedera.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Hedera Portal
                </a>{" "}
                to create a free testnet account.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Hedera USDC Faucet. For testing purposes only.</p>
            <div className="flex gap-6 text-sm">
              <a
                href="https://docs.hedera.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Documentation
              </a>
              <a
                href="https://hedera.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Hedera.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
