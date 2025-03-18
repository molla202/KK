import Image from "next/image"

export function Logo() {
  return (
    <div className="relative w-20 h-20">
      <Image src="/placeholder.svg?height=80&width=80" alt="0G Logo" fill className="object-contain" />
    </div>
  )
}

