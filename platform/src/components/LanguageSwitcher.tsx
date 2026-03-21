'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LanguageSwitcher() {
  const t = useTranslations('languageSwitcher')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const otherLocale = locale === 'en' ? 'zh' : 'en'

  const switchLocale = () => {
    router.replace(pathname, { locale: otherLocale })
  }

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1.5 rounded-lg bg-dark-card border border-white/10 text-gray-300 hover:text-white hover:border-accent/50 transition-colors text-sm font-medium cursor-pointer"
      aria-label={`Switch to ${otherLocale === 'en' ? 'English' : '中文'}`}
    >
      {t(otherLocale)}
    </button>
  )
}
