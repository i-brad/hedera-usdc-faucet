"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, Droplets } from "lucide-react"

export function FaucetForm() {
  const [accountId, setAccountId] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
    txId?: string
  }>({ type: null, message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate account ID format
    const accountIdRegex = /^0\.0\.\d+$/
    if (!accountIdRegex.test(accountId)) {
      setStatus({
        type: "error",
        message: "Invalid account ID format. Please use format: 0.0.xxxxx",
      })
      return
    }

    setLoading(true)
    setStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request")
      }

      setStatus({
        type: "success",
        message: `Successfully sent 100 USDC to ${accountId}`,
        txId: data.transactionId,
      })
      setAccountId("")
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-accent" />
          Request Test USDC
        </CardTitle>
        <CardDescription>Enter your Hedera testnet account ID to receive 100 USDC tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="accountId" className="text-sm font-medium">
              Hedera Account ID
            </label>
            <Input
              id="accountId"
              type="text"
              placeholder="0.0.123456"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              disabled={loading}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">Format: 0.0.xxxxx (e.g., 0.0.123456)</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !accountId} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Droplets className="mr-2 h-4 w-4" />
                Request 100 USDC
              </>
            )}
          </Button>

          {status.type && (
            <Alert variant={status.type === "error" ? "destructive" : "default"}>
              {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>
                {status.message}
                {status.txId && <div className="mt-2 text-xs font-mono break-all">Transaction ID: {status.txId}</div>}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
