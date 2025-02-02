import './globals.css'
import { NavBar } from '@/components/layout/nav-bar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <div className="min-h-full">
          <NavBar />
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 