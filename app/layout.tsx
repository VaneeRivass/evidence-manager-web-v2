import type { Metadata } from 'next'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gestor de evidencias',
  description: 'Cada caso, con su evidencia a mano.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-right"
          closeButton
          theme="light"
          toastOptions={{
            classNames: {
              toast:
                'rounded-2xl border border-line bg-card text-ink shadow-[0_16px_40px_rgba(22,28,45,.16)]',
              title: 'text-[13.5px] font-semibold text-ink',
              description: 'text-[12.5px] text-muted',
              actionButton:
                'rounded-full bg-brand px-3 py-1.5 text-[12px] font-semibold text-white',
              cancelButton:
                'rounded-full border border-line bg-card px-3 py-1.5 text-[12px] font-semibold text-ink',
              closeButton: 'border-line bg-card text-muted',
            },
          }}
        />
      </body>
    </html>
  )
}
