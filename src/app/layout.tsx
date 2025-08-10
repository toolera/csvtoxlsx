import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free CSV to Excel Converter - Convert CSV to XLSX Online',
  description: 'Convert CSV files to Excel (XLSX) format instantly. Free, secure, and fast online CSV to Excel converter. No registration required. Works on mobile and desktop.',
  keywords: [
    'CSV to Excel',
    'CSV to XLSX',
    'convert CSV',
    'Excel converter',
    'online converter',
    'free CSV converter',
    'CSV Excel',
    'spreadsheet converter',
    'file converter',
    'CSV XLSX converter'
  ],
  authors: [{ name: 'CSV to Excel Converter' }],
  creator: 'CSV to Excel Converter',
  publisher: 'CSV to Excel Converter',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://csvtoxlsx.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Free CSV to Excel Converter - Convert CSV to XLSX Online',
    description: 'Convert CSV files to Excel (XLSX) format instantly. Free, secure, and fast online CSV to Excel converter. No registration required.',
    url: 'https://csvtoxlsx.vercel.app',
    siteName: 'CSV to Excel Converter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CSV to Excel Converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free CSV to Excel Converter - Convert CSV to XLSX Online',
    description: 'Convert CSV files to Excel (XLSX) format instantly. Free, secure, and fast online CSV to Excel converter.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CSV to Excel Converter',
  description: 'Convert CSV files to Excel (XLSX) format instantly. Free, secure, and fast online CSV to Excel converter.',
  url: 'https://csvtoxlsx.vercel.app',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Convert CSV to Excel (XLSX)',
    'Free online converter',
    'No registration required',
    'Mobile friendly',
    'Secure file processing',
    'Instant download'
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="bg-gray-50 min-h-screen antialiased">{children}</body>
    </html>
  )
}