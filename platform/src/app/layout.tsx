import type { Metadata } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import './globals.css'

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'CEO of One Training Camp - 一个人就是一家公司',
  description: '2026 年，你不需要学编程，不需要组建团队。你说一句话，AI 帮你把产品做出来。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={notoSansSC.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
