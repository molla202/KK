"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Droplets, Thermometer } from "lucide-react"

export default function Faucet() {
  const [isOn, setIsOn] = useState(false)
  const [temperature, setTemperature] = useState(50)
  const [flowRate, setFlowRate] = useState(50)
  const [droplets, setDroplets] = useState<Array<{ id: number; left: number; delay: number }>>([])

  // Generate water droplets when faucet is on
  useEffect(() => {
    if (!isOn) {
      setDroplets([])
      return
    }

    const interval = setInterval(
      () => {
        if (droplets.length < 15) {
          setDroplets((prev) => [
            ...prev,
            {
              id: Math.random(),
              left: Math.floor(Math.random() * 80) + 10,
              delay: Math.random() * 0.5,
            },
          ])
        } else {
          setDroplets((prev) => {
            const newDroplets = [...prev]
            newDroplets.shift()
            return [
              ...newDroplets,
              {
                id: Math.random(),
                left: Math.floor(Math.random() * 80) + 10,
                delay: Math.random() * 0.5,
              },
            ]
          })
        }
      },
      300 - flowRate * 2,
    )

    return () => clearInterval(interval)
  }, [isOn, flowRate, droplets.length])

  // Calculate water color based on temperature
  const getWaterColor = () => {
    if (temperature < 30) return "bg-blue-400"
    if (temperature < 70) return "bg-blue-300"
    return "bg-red-300"
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <div className="w-full bg-gray-100 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Interactive Faucet</h2>

        {/* Faucet body */}
        <div className="relative h-64 flex flex-col items-center">
          {/* Faucet base */}
          <div className="w-20 h-8 bg-gray-300 rounded-t-lg"></div>

          {/* Faucet neck */}
          <div className="w-8 h-32 bg-gradient-to-b from-gray-300 to-gray-400 rounded-md"></div>

          {/* Faucet spout */}
          <div className="w-32 h-8 bg-gradient-to-r from-gray-400 to-gray-300 rounded-md relative -mt-4">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-gray-500 rounded-b-lg"></div>

            {/* Water stream */}
            {isOn && (
              <div
                className={cn(
                  "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 rounded-b-lg transition-all duration-300",
                  getWaterColor(),
                )}
                style={{
                  height: `${flowRate}px`,
                  opacity: flowRate / 100,
                }}
              ></div>
            )}

            {/* Water droplets */}
            {droplets.map((droplet) => (
              <div
                key={droplet.id}
                className={cn("absolute w-2 h-2 rounded-full animate-fall", getWaterColor())}
                style={{
                  left: `${droplet.left}%`,
                  bottom: "-20px",
                  animationDelay: `${droplet.delay}s`,
                  animationDuration: `${1 - flowRate / 200}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Faucet handle */}
          <div
            className={cn(
              "absolute top-12 right-12 w-16 h-8 bg-gray-400 rounded-md cursor-pointer transform transition-transform duration-300",
              isOn ? "rotate-45" : "rotate-0",
            )}
            onClick={() => setIsOn(!isOn)}
          >
            <div className="w-4 h-4 bg-red-500 rounded-full absolute top-2 right-2"></div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5" />
                <span className="font-medium">Temperature</span>
              </div>
              <span
                className={cn(
                  "px-2 py-1 rounded text-white text-sm",
                  temperature < 30 ? "bg-blue-500" : temperature < 70 ? "bg-blue-400" : "bg-red-500",
                )}
              >
                {temperature}°
              </span>
            </div>
            <Slider
              value={[temperature]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setTemperature(value[0])}
              className={cn(
                "w-full",
                temperature < 30 ? "accent-blue-500" : temperature < 70 ? "accent-blue-400" : "accent-red-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Droplets className="mr-2 h-5 w-5" />
                <span className="font-medium">Flow Rate</span>
              </div>
              <span className="px-2 py-1 bg-blue-500 rounded text-white text-sm">{flowRate}%</span>
            </div>
            <Slider
              value={[flowRate]}
              min={0}
              max={100}
              step={1}
              disabled={!isOn}
              onValueChange={(value) => setFlowRate(value[0])}
            />
          </div>

          <Button onClick={() => setIsOn(!isOn)} className="w-full" variant={isOn ? "destructive" : "default"}>
            {isOn ? "Turn Off" : "Turn On"}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100px);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 1s linear forwards;
        }
      `}</style>
    </div>
  )
}

