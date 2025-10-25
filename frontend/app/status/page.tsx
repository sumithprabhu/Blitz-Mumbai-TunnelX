"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useState } from "react"
import { WorldDots } from "@/components/world-dots"

interface NetworkNode {
  id: string
  region: string
  country: string
  status: "active" | "offline"
  price: number
  uptime: number
  lat: number
  lng: number
}

const NETWORK_NODES: NetworkNode[] = [
  {
    id: "node_001",
    region: "India",
    country: "IN",
    status: "active",
    price: 0.01,
    uptime: 97,
    lat: 20.5937,
    lng: 78.9629,
  },
  {
    id: "node_002",
    region: "Singapore",
    country: "SG",
    status: "active",
    price: 0.012,
    uptime: 99,
    lat: 1.3521,
    lng: 103.8198,
  },
  {
    id: "node_003",
    region: "Germany",
    country: "DE",
    status: "active",
    price: 0.015,
    uptime: 98,
    lat: 51.1657,
    lng: 10.4515,
  },
  {
    id: "node_004",
    region: "US East",
    country: "US",
    status: "active",
    price: 0.011,
    uptime: 96,
    lat: 37.0902,
    lng: -95.7129,
  },
  {
    id: "node_005",
    region: "Japan",
    country: "JP",
    status: "offline",
    price: 0.013,
    uptime: 94,
    lat: 36.2048,
    lng: 138.2529,
  },
  {
    id: "node_006",
    region: "Brazil",
    country: "BR",
    status: "active",
    price: 0.009,
    uptime: 95,
    lat: -14.235,
    lng: -51.9253,
  },
]

export default function StatusPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNodes = NETWORK_NODES.filter(
    (node) =>
      node.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeNodes = filteredNodes.filter((n) => n.status === "active").length
  const totalBandwidth = (filteredNodes.length * 0.85).toFixed(1)
  const avgLatency = Math.round(
    filteredNodes.reduce((acc, n) => acc + (n.status === "active" ? 35 : 0), 0) / activeNodes,
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Network Status</h1>
          <p className="text-foreground/60">Monitor the global VPN node network in real-time</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-border neon-border">
            <p className="text-sm text-foreground/60 mb-2">Total Nodes</p>
            <p className="text-3xl font-bold text-secondary">{NETWORK_NODES.length}</p>
          </Card>

          <Card className="p-6 border-border neon-border">
            <p className="text-sm text-foreground/60 mb-2">Online</p>
            <p className="text-3xl font-bold text-green-400">{activeNodes}</p>
          </Card>

          <Card className="p-6 border-border neon-border">
            <p className="text-sm text-foreground/60 mb-2">Total Bandwidth</p>
            <p className="text-3xl font-bold">{totalBandwidth} TB</p>
          </Card>

          <Card className="p-6 border-border neon-border">
            <p className="text-sm text-foreground/60 mb-2">Avg Latency</p>
            <p className="text-3xl font-bold">{avgLatency} ms</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="p-6 border-border neon-border overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 h-96">
              <WorldDots nodes={filteredNodes} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search region or node"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-foreground/40 focus:border-secondary focus:outline-none"
              />
            </div>

            {/* Node List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredNodes.map((node) => (
                <Card
                  key={node.id}
                  className="p-3 border-border hover:border-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            node.status === "active" ? "bg-green-400" : "bg-gray-600"
                          }`}
                        />
                        <p className="font-medium text-sm truncate">{node.region}</p>
                      </div>
                      <p className="text-xs text-foreground/60 truncate">{node.id}</p>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-foreground/60">
                    <p>Price: {node.price} MON/GB</p>
                    <p>Uptime: {node.uptime}%</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
