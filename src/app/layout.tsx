import { UserProvider } from "@auth0/nextjs-auth0/client"
import { SessionProvider } from "next-auth/react"

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <SessionProvider>
          <body>{children}</body>
        </SessionProvider>
      </UserProvider>
    </html>
  )
}
