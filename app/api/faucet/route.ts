import { type NextRequest, NextResponse } from "next/server"
import { Client, AccountId, PrivateKey, TransferTransaction } from "@hashgraph/sdk"

// Rate limiting store (in production, use Redis or a database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 3 // requests per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const FAUCET_AMOUNT = 100 // USDC amount to send

function checkRateLimit(accountId: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(accountId)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(accountId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() })
}

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json()

    // Validate account ID
    if (!accountId || typeof accountId !== "string") {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400, headers: corsHeaders() })
    }

    // Validate format
    const accountIdRegex = /^0\.0\.\d+$/
    if (!accountIdRegex.test(accountId)) {
      return NextResponse.json({ error: "Invalid account ID format" }, { status: 400, headers: corsHeaders() })
    }

    // Check rate limit
    if (!checkRateLimit(accountId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: corsHeaders() },
      )
    }

    // In production, these should be environment variables
    // For demo purposes, we'll show the structure
    const operatorId = process.env.HEDERA_OPERATOR_ID
    const operatorKey = process.env.HEDERA_OPERATOR_KEY
    const usdcTokenId = process.env.HEDERA_USDC_TOKEN_ID || "0.0.456858" // Example testnet USDC token ID

    if (!operatorId || !operatorKey) {
      return NextResponse.json(
        { error: "Faucet not configured. Please set up environment variables." },
        { status: 500, headers: corsHeaders() },
      )
    }

    const client = Client.forTestnet().setOperator(
      AccountId.fromString(operatorId),
      PrivateKey.fromStringECDSA(operatorKey),
    )

    // Create transfer transaction
    const transaction = new TransferTransaction()
      .addTokenTransfer(usdcTokenId, operatorId, -FAUCET_AMOUNT * 1_000_000) // USDC has 6 decimals
      .addTokenTransfer(usdcTokenId, accountId, FAUCET_AMOUNT * 1_000_000)
      .setTransactionMemo("Hedera USDC Faucet")

    // Execute transaction
    const txResponse = await transaction.execute(client)
    const receipt = await txResponse.getReceipt(client)

    // Close client
    client.close()

    return NextResponse.json(
      {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        amount: FAUCET_AMOUNT,
      },
      { headers: corsHeaders() },
    )
  } catch (error) {
    console.error("[v0] Faucet error:", error)
    return NextResponse.json(
      { error: "Failed to process faucet request. Please try again." },
      { status: 500, headers: corsHeaders() },
    )
  }
}
