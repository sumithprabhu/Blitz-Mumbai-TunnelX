"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Wifi, ChevronDown, X } from "lucide-react"

interface Node {
  id: string
  region: string
  flag: string
  price: number
  latency: number
  status: "good" | "fair" | "poor"
}

const NODES: Node[] = [
  { id: "node_001", region: "India", flag: "🇮🇳", price: 0.01, latency: 45, status: "good" },
  { id: "node_002", region: "Singapore", flag: "🇸🇬", price: 0.012, latency: 32, status: "good" },
  { id: "node_003", region: "Germany", flag: "🇩🇪", price: 0.015, latency: 28, status: "good" },
  { id: "node_004", region: "US East", flag: "🇺🇸", price: 0.011, latency: 52, status: "fair" },
]

export default function ConnectPage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [dataUsed, setDataUsed] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletAction, setWalletAction] = useState<"deposit" | "withdraw" | null>(null)
  const [walletAmount, setWalletAmount] = useState("")
  const [balance, setBalance] = useState(2.5)

  const handleSelectNode = (node: Node) => {
    setSelectedNode(node)
    setDropdownOpen(false)
  }

  const handleConnect = () => {
    if (selectedNode) {
      setIsConnected(true)
      setSessionTime(0)
      setDataUsed(0)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setSelectedNode(null)
  }

  const handleWalletAction = () => {
    if (walletAction === "deposit") {
      setBalance(balance + Number.parseFloat(walletAmount))
    } else if (walletAction === "withdraw") {
      setBalance(Math.max(0, balance - Number.parseFloat(walletAmount)))
    }
    setWalletAmount("")
    setWalletAction(null)
  }

  const getLatencyColor = (latency: number) => {
    if (latency < 40) return "text-green-400"
    if (latency < 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Connect to VPN</h1>
            <p className="text-foreground/60">Select a node and connect to start using the VPN</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowWalletModal(!showWalletModal)}
              className="px-4 py-2 rounded-lg bg-card border border-border text-foreground hover:border-secondary transition-colors"
            >
              💰 {balance.toFixed(2)} MON
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
                        value={walletAmount}
                        onChange={(e) => setWalletAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:border-secondary focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleWalletAction} className="flex-1 bg-secondary text-secondary-foreground">
                          Confirm
                        </Button>
                        <Button
                          onClick={() => {
                            setWalletAction(null)
                            setWalletAmount("")
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
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Panel - Node Selection */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground hover:border-secondary transition-colors flex items-center justify-between"
              >
                <span>{selectedNode ? `${selectedNode.flag} ${selectedNode.region}` : "Select a node"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
                  {NODES.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => handleSelectNode(node)}
                      className="w-full px-4 py-3 text-left hover:bg-secondary/10 border-b border-border/50 last:border-b-0 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{node.flag}</span>
                        <div>
                          <p className="font-medium">{node.region}</p>
                          <p className="text-xs text-foreground/60">{node.price} MON/GB</p>
                        </div>
                      </div>
                      <p className={`text-sm font-medium ${getLatencyColor(node.latency)}`}>{node.latency}ms</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedNode && (
              <Button
                onClick={handleConnect}
                disabled={isConnected}
                className="w-full bg-secondary text-secondary-foreground py-6 text-base glow-violet-hover"
              >
                {isConnected ? "Connected" : "Connect"}
              </Button>
            )}

            {/* Node Details Card */}
            {selectedNode && (
              <Card className="p-6 border-border neon-border">
                <h3 className="text-lg font-semibold mb-4">Node Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Region</span>
                    <span className="font-medium">{selectedNode.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Price</span>
                    <span className="font-medium text-secondary">{selectedNode.price} MON/GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Latency</span>
                    <span className={`font-medium ${getLatencyColor(selectedNode.latency)}`}>
                      {selectedNode.latency}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Status</span>
                    <span className="font-medium capitalize text-green-400">{selectedNode.status}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Session Stats */}
          <div className="space-y-4">
            <Card className="p-6 border-border neon-border">
              <h3 className="text-lg font-semibold mb-6">Session Stats</h3>

              {isConnected ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm text-foreground/60">Session Time</p>
                    <p className="text-3xl font-bold text-secondary">
                      {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-foreground/60">Data Used</p>
                    <p className="text-2xl font-bold">{dataUsed.toFixed(2)} MB</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-foreground/60">Estimated Cost</p>
                    <p className="text-2xl font-bold text-secondary">
                      {((dataUsed * selectedNode!.price) / 1024).toFixed(4)} MON
                    </p>
                  </div>

                  <Button onClick={handleDisconnect} className="w-full bg-red-600 hover:bg-red-700 text-white">
                    End Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-center py-8">
                  <Wifi className="w-12 h-12 text-foreground/30 mx-auto" />
                  <p className="text-foreground/60">Select a node to start a session</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
