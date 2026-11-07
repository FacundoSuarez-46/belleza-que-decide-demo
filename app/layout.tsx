import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Silvia Garbarino | Young, Río Negro',
  description:
    'Belleza para compartir en Young, Río Negro. Conocé los looks, las clases y la comunidad de Silvia Garbarino.',
  applicationName: 'Silvia Garbarino',
  openGraph: {
    title: 'Silvia Garbarino | Young, Río Negro',
    description:
      'Un espacio cercano para descubrir, aprender y disfrutar del cuidado a tu manera.',
    locale: 'es_UY',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f0e8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-UY">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
