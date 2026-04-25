
import ConfigProvider from 'antd/es/config-provider'
import enUS from 'antd/lib/locale/en_US'
import esES from 'antd/lib/locale/es_ES'
import { useTranslation } from 'react-i18next'
import { LanguageCode } from '@/enums/LanguageCode'
import { ENV } from '@/utils/env'
import { childrenShape } from '@/utils/propTypes'

const LANGUAGE_TO_ANTD_LOCALE = {
  [LanguageCode.en_US]: enUS,
  [LanguageCode.es_ES]: esES,
}

const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()

  const lang = i18n.resolvedLanguage || ENV.FALLBACK_LANG
  const antdLocale = LANGUAGE_TO_ANTD_LOCALE[lang]

  return (
    <ConfigProvider locale={antdLocale}>
      {children}
    </ConfigProvider>
  )
}

LanguageProvider.propTypes = {
  children: childrenShape.isRequired,
}

export {
  LanguageProvider,
}
