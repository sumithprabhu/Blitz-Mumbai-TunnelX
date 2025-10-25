"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletAction, setWalletAction] = useState<"deposit" | "withdraw" | null>(null)
  const [amount, setAmount] = useState("")
  const [balance, setBalance] = useState(2.5)

  const isActive = (path: string) => pathname === path

  const handleWalletAction = () => {
    if (walletAction === "deposit") {
      setBalance(balance + Number.parseFloat(amount))
    } else if (walletAction === "withdraw") {
      setBalance(Math.max(0, balance - Number.parseFloat(amount)))
    }
    setAmount("")
    setWalletAction(null)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VPN Mon
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-secondary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/connect"
              className={`text-sm font-medium transition-colors ${
                isActive("/connect") ? "text-secondary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Connect
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive("/dashboard") ? "text-secondary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/status"
              className={`text-sm font-medium transition-colors ${
                isActive("/status") ? "text-secondary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Status
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Wallet Button */}
            <div className="relative">
              <button
                onClick={() => setShowWalletModal(!showWalletModal)}
                className="px-4 py-2 rounded-lg bg-card border border-border text-foreground hover:border-secondary transition-colors flex items-center gap-2"
              >
                💰 {balance.toFixed(2)} MON
                <ChevronDown className={`w-4 h-4 transition-transform ${showWalletModal ? "rotate-180" : ""}`} />
              </button>

              {showWalletModal && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">Wallet</h3>
                    <button onClick={() => setShowWalletModal(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="text-center mb-4">
                      <p className="text-sm text-foreground/60">Balance</p>
                      <p className="text-2xl font-bold text-secondary">{balance.toFixed(2)} MON</p>
                    </div>

                    {!walletAction ? (
                      <div className="space-y-2">
                        <Button
                          onClick={() => setWalletAction("deposit")}
                          className="w-full bg-secondary text-secondary-foreground"
                        >
                          Deposit
                        </Button>
                        <Button onClick={() => setWalletAction("withdraw")} variant="outline" className="w-full">
                          Withdraw
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm font-medium capitalize">{walletAction}</p>
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:border-secondary focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleWalletAction}
                            className="flex-1 bg-secondary text-secondary-foreground"
                          >
                            Confirm
                          </Button>
                          <Button
                            onClick={() => {
                              setWalletAction(null)
                              setAmount("")
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Connect Wallet Button */}
            <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm glow-violet-hover transition-all duration-300">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
