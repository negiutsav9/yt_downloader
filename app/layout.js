import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YouTube Downloader',
  description: 'Download YouTube videos without ads and subscriptions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className='app'>
            {children}
        </main>
      </body>
    </html>
  )
}
