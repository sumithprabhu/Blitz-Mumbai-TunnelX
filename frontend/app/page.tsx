"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import Lottie from "lottie-react"
import networkGlobeAnimation from "@/public/network-globe.json"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-20" />
        <div className="absolute inset-0 grid-overlay" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="fade-in-up space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                  Privacy.{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Performance.
                  </span>{" "}
                  Decentralized.
                </h1>
                <p className="text-xl text-foreground/70 text-balance">
                  Connect to a global network of community-powered VPN nodes on Monad.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/connect">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-secondary text-secondary-foreground glow-violet-hover"
                  >
                    Connect Wallet & Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-secondary/50 text-foreground hover:bg-secondary/10 bg-transparent"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-secondary">1</p>
                  <p className="text-sm text-foreground/60">Live Nodes Active</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-secondary">0 MB</p>
                  <p className="text-sm text-foreground/60">Bandwidth Shared</p>
                </div>
              </div>
            </div>

            {/* Right - Network Visualization */}
            <div className="relative h-96 md:h-full min-h-96 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-[516px] h-[516px]">
                  <Lottie
                    animationData={networkGlobeAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-[516px] h-[516px] opacity-40"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Node Provider Section */}
      <section className="relative py-20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Server Illustration */}
            <div className="relative h-96 flex items-center justify-center order-2 md:order-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="space-y-4">
                  <div className="w-48 h-32 rounded-lg bg-gradient-to-br from-primary to-secondary/50 border border-secondary/50 flex items-center justify-center glow-violet">
                    <div className="text-center">
                      <Zap className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-sm font-semibold text-white">Earn Node Credits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8 order-1 md:order-2">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-balance">
                  Become a{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Node Provider
                  </span>
                </h2>
                <p className="text-lg text-foreground/70">
                  Run a node, stake, and earn as users connect through your region.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-card border border-border/50 neon-border">
                  <p className="text-sm text-foreground/60">
                    <span className="font-semibold text-secondary">Live Nodes Active:</span> 1
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border/50 neon-border">
                  <p className="text-sm text-foreground/60">
                    <span className="font-semibold text-secondary">Total Bandwidth Shared:</span> 0 MB
                  </p>
                </div>
              </div>

              <Link href="/dashboard">
                <Button size="lg" className="w-full bg-secondary text-secondary-foreground glow-violet-hover">
                  Start Earning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-sm text-foreground/60">Powered by Monad ⚡</div>
            <div className="flex items-center gap-6">
              
              <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                GitHub
              </a>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
