import { Toaster } from "sonner"
import "@/styles/globals.css"
import type React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
