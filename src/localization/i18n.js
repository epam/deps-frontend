
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { LanguageCode } from '@/enums/LanguageCode'
import { ENV } from '@/utils/env'
import { TRANSLATION_EN_US } from './translations/en-US'
import { TRANSLATION_ES_ES } from './translations/es-ES'

const LANGUAGE_CODE_TO_TRANSLATION = {
  [LanguageCode.en_US]: TRANSLATION_EN_US,
  [LanguageCode.es_ES]: TRANSLATION_ES_ES,
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: ENV.FALLBACK_LANG,
    debug: ENV.IS_DEV,
    resources: {
      [LanguageCode.en_US]: {
        translation: TRANSLATION_EN_US,
      },
      [LanguageCode.es_ES]: {
        translation: TRANSLATION_ES_ES,
      },
    },
  })

const localize = i18n.t.bind(i18n)
const lang = i18n.resolvedLanguage || ENV.FALLBACK_LANG
const translation = LANGUAGE_CODE_TO_TRANSLATION[lang]
const Localization = Object.keys(translation).reduce((a, key) => ({
  ...a,
  [key]: key,
}), {})

export {
  localize,
  Localization,
}
