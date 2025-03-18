"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Droplets, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Image from "next/image"

export function Faucet() {
  const [address, setAddress] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [txHash, setTxHash] = useState("")

  // Fixed amount of 0.1 0G tokens
  const fixedAmount = "0.1"
  const tokenName = "0G"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic address validation
    if (!address || address.length < 30) {
      setStatus("error")
      setMessage("Lütfen geçerli bir adres girin")
      return
    }

    setStatus("loading")
    setMessage("İşleminiz gerçekleştiriliyor...")

    try {
      // API'ye istek gönder
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setTxHash(data.txHash)
        setStatus("success")
        setMessage(`${fixedAmount} ${tokenName} başarıyla gönderildi!`)
      } else {
        setStatus("error")
        setMessage(data.error || "Token gönderimi sırasında bir hata oluştu.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Sunucu ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.")
    }
  }

  const resetForm = () => {
    setStatus("idle")
    setMessage("")
    setTxHash("")
  }

  return (
    <Card className="w-full border-blue-500/20 bg-black/60 backdrop-blur-sm text-white shadow-xl">
      <CardHeader className="border-b border-blue-500/20 pb-6">
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Logo */}
          <div className="w-20 h-20 rounded-full bg-blue-900/50 border-2 border-blue-400/30 flex items-center justify-center mb-2 overflow-hidden">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="0G Logo"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold">0G Ağı Faucet</CardTitle>
          <CardDescription className="text-gray-400 mt-1">Test ağında kullanmak için 0G tokenleri alın</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {status === "success" && (
          <Alert className="mb-4 border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-500">Başarılı!</AlertTitle>
            <AlertDescription className="text-green-400">
              {message}
              {txHash && (
                <div className="mt-2">
                  <p className="text-sm font-medium">İşlem Hash:</p>
                  <code className="block p-2 mt-1 bg-black/30 rounded text-xs overflow-x-auto">{txHash}</code>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mb-4 border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Hata</AlertTitle>
            <AlertDescription className="text-red-400">{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-300">
              0G Adresiniz
            </label>
            <Input
              id="address"
              placeholder="Adresinizi buraya girin..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-blue-950/20 border-blue-500/30 text-white placeholder:text-gray-500"
              disabled={status === "loading"}
            />
            <p className="text-xs text-gray-500">0G test ağı için geçerli bir adres girin</p>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Alacağınız miktar:</span>
              <span className="font-bold text-blue-400">
                {fixedAmount} {tokenName}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                <span>Her adres günde bir kez istek yapabilir</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-blue-500/20 pt-6">
        {status === "success" ? (
          <Button
            onClick={resetForm}
            variant="outline"
            className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-950/50 hover:text-blue-300"
          >
            Yeni İstek
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={status === "loading" || !address}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                İşleniyor...
              </>
            ) : (
              `${fixedAmount} ${tokenName} İste`
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

