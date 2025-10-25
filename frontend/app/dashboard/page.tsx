"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Copy, Check, X } from "lucide-react"

export default function DashboardPage() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [nodeId, setNodeId] = useState("")
  const [authKey, setAuthKey] = useState("")
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [earnings, setEarnings] = useState(0.045)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [formData, setFormData] = useState({
    region: "US East",
    pricePerGB: "0.01",
    stakeAmount: "10",
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setNodeId("node_0x39a...9dE")
    setAuthKey("2f39f9s0-fd12")
    setIsRegistered(true)
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleWithdraw = () => {
    if (withdrawAmount && Number.parseFloat(withdrawAmount) <= earnings) {
      setEarnings(earnings - Number.parseFloat(withdrawAmount))
      setWithdrawAmount("")
      setIsWithdrawing(false)
      setShowWalletModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Run a Node & Earn</h1>
            <p className="text-foreground/60">Become a node provider and earn rewards</p>
          </div>

          {isRegistered && (
            <div className="relative">
              <button
                onClick={() => setShowWalletModal(!showWalletModal)}
                className="px-4 py-2 rounded-lg bg-card border border-border text-foreground hover:border-secondary transition-colors"
              >
                💰 {earnings.toFixed(3)} MON
              </button>

              {showWalletModal && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">Earnings</h3>
                    <button onClick={() => setShowWalletModal(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="text-center mb-4">
                      <p className="text-sm text-foreground/60">Total Earnings</p>
                      <p className="text-2xl font-bold text-secondary">{earnings.toFixed(3)} MON</p>
                    </div>

                    {!isWithdrawing ? (
                      <Button
                        onClick={() => setIsWithdrawing(true)}
                        className="w-full bg-secondary text-secondary-foreground"
                      >
                        Withdraw
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Withdraw Amount</p>
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          max={earnings}
                          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:border-secondary focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleWithdraw} className="flex-1 bg-secondary text-secondary-foreground">
                            Confirm
                          </Button>
                          <Button
                            onClick={() => {
                              setIsWithdrawing(false)
                              setWithdrawAmount("")
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
          )}
        </div>

        {!isRegistered ? (
          // Pre-registration Form
          <div className="max-w-2xl">
            <Card className="p-8 border-border neon-border">
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:border-secondary focus:outline-none"
                  >
                    <option>US East</option>
                    <option>US West</option>
                    <option>Europe</option>
                    <option>Asia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price per GB (MON)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.pricePerGB}
                    onChange={(e) => setFormData({ ...formData, pricePerGB: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stake Amount (MON)</label>
                  <input
                    type="number"
                    value={formData.stakeAmount}
                    onChange={(e) => setFormData({ ...formData, stakeAmount: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value="0x742d35Cc6634C0532925a3b844Bc9e7595f9dE"
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground/60 cursor-not-allowed"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-secondary text-secondary-foreground glow-violet-hover py-6 text-base"
                >
                  Generate Node Key
                </Button>
              </form>
            </Card>
          </div>
        ) : (
          // Post-registration Dashboard
          <div className="space-y-8">
            {/* Node Credentials */}
            <Card className="p-8 border-border neon-border">
              <h2 className="text-2xl font-bold mb-6">Your Node Credentials</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/60 mb-2">Node ID</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nodeId}
                      disabled
                      className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-foreground cursor-not-allowed"
                    />
                    <Button size="sm" variant="outline" onClick={() => handleCopy(nodeId, "nodeId")}>
                      {copiedField === "nodeId" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/60 mb-2">Auth Key</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={authKey}
                      disabled
                      className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-foreground cursor-not-allowed"
                    />
                    <Button size="sm" variant="outline" onClick={() => handleCopy(authKey, "authKey")}>
                      {copiedField === "authKey" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-foreground/60 pt-2">Use this key to start your local node runner.</p>
              </div>
            </Card>

            {/* Dashboard Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-border neon-border">
                <p className="text-sm text-foreground/60 mb-2">Earnings Today</p>
                <p className="text-3xl font-bold text-secondary">{earnings.toFixed(3)} MON</p>
                <p className="text-xs text-foreground/40 mt-2">+12% from yesterday</p>
              </Card>

              <Card className="p-6 border-border neon-border">
                <p className="text-sm text-foreground/60 mb-2">Total Bandwidth Shared</p>
                <p className="text-3xl font-bold">4.2 GB</p>
                <p className="text-xs text-foreground/40 mt-2">This month</p>
              </Card>

              <Card className="p-6 border-border neon-border">
                <p className="text-sm text-foreground/60 mb-2">Node Status</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-lg font-semibold">Online</p>
                </div>
                <Button className="w-full mt-4 bg-secondary text-secondary-foreground">Go Live</Button>
              </Card>
            </div>

            {/* Activity Log */}
            <Card className="p-6 border-border neon-border">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div>
                    <p className="text-sm font-medium">[10:32 AM] Session started by user_0x12d…9aF</p>
                    <p className="text-xs text-foreground/60">Connected for 15 minutes</p>
                  </div>
                  <p className="text-sm text-secondary">+0.002 MON</p>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div>
                    <p className="text-sm font-medium">[11:01 AM] Session closed — earned 0.003 MON</p>
                    <p className="text-xs text-foreground/60">Data transferred: 256 MB</p>
                  </div>
                  <p className="text-sm text-secondary">+0.003 MON</p>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">[09:45 AM] Node went online</p>
                    <p className="text-xs text-foreground/60">Status: Healthy</p>
                  </div>
                  <p className="text-sm text-foreground/60">—</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
