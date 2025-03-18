import { Faucet } from "@/components/faucet"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-black">
      <div className="max-w-md w-full">
        <Faucet />
      </div>
    </main>
  )
}

