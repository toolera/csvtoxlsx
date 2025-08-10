import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CSV to Excel Converter',
  description: 'Convert your CSV files to Excel format online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}