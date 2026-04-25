
import PropTypes from 'prop-types'
import { Localization, localize } from '@/localization/i18n'

class Language {
  constructor (code, name) {
    this.code = code
    this.name = name
  }

  static toOption = (language) => ({
    value: language.code,
    text: language.name,
  })

  static toOptionsWithDefault = (languages, defaultLanguage) => (
    languages.map((l) => {
      if (l.code === defaultLanguage) {
        const language = Language.toOption(l)

        return {
          ...language,
          text: localize(Localization.DEFAULT_VALUE, { value: l.name }),
        }
      }

      return Language.toOption(l)
    })
  )
}

const languageShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
})

export {
  Language,
  languageShape,
}
