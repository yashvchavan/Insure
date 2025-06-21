import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import ChatbotButton from "@/components/ChatbotButton"
import VoiceNavButton from "@/components/VoiceNavButton"
import PolicyOverview from "@/components/PolicyOverview"
import { ThemeProvider } from "@/components/ThemeProvider"
import Link from "next/link"
import { User } from "lucide-react"
import Footer from "@/components/Footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InsureEase - Modern Insurance Platform",
  description: "Your one-stop solution for all insurance needs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <div className="fixed bottom-4 right-4 z-50">
              <ChatbotButton />
            </div>
            <div className="fixed bottom-4 right-20 z-50">
              <VoiceNavButton />
            </div>
            <div className="fixed bottom-4 left-4 z-50 md:block hidden">
              <PolicyOverview />
            </div>
            <div className="fixed bottom-4 left-20 z-50">
              <Link href="/user-dashboard">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <User className="h-6 w-6" />
                </div>
              </Link>
            </div>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

