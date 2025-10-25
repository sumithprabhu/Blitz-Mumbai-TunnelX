"use client"

import { useEffect, useState } from "react"
import Globe from "react-globe.gl"

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

export function WorldDots({ nodes }: { nodes: NetworkNode[] }) {
  const [pointsData, setPointsData] = useState<Array<{ lat: number; lng: number; status: string }>>([])

  useEffect(() => {
    const points = nodes.map((node) => ({
      lat: node.lat,
      lng: node.lng,
      status: node.status,
    }))
    setPointsData(points)
  }, [nodes])

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="#0a0a0a"
        pointsData={pointsData}
        pointColor={(d: any) => (d.status === "active" ? "#ad49e1" : "#666666")}
        pointAltitude={0.02}
        pointRadius={0.4}
        atmosphereColor="#ad49e1"
        atmosphereAltitude={0.15}
        enablePointerInteraction={true}
      />
    </div>
  )
}
