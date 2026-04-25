
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from '@/components/Dropdown'
import { Menu, MenuTrigger } from '@/components/Menu'
import { LanguageCode } from '@/enums/LanguageCode'
import { Button, MenuItem } from './LanguageSwitch.styles'

const LANGUAGE_CODE_TO_RESOURCE = {
  [LanguageCode.en_US]: 'English',
  [LanguageCode.es_ES]: 'Español',
}

const getShortLangCode = (lngCode) => (
  lngCode.split('-')[0].toUpperCase()
)

const LanguageSwitch = () => {
  const { i18n } = useTranslation()

  const changeLanguage = useCallback(async (lngCode) => {
    await i18n.changeLanguage(lngCode)
    window.location.reload()
  }, [i18n])

  const renderMenu = useCallback(
    () => (
      <Menu
        selectable
        trigger={MenuTrigger.CLICK}
      >
        {
          Object.keys(LANGUAGE_CODE_TO_RESOURCE).map((code) => (
            <MenuItem
              key={code}
              $selected={i18n.resolvedLanguage === code}
              id={code}
              onClick={() => changeLanguage(code)}
            >
              {`${getShortLangCode(code)} - `}
              {LANGUAGE_CODE_TO_RESOURCE[code]}
            </MenuItem>
          ))
        }
      </Menu>
    ),
    [
      changeLanguage,
      i18n.resolvedLanguage,
    ],
  )

  return (
    <Dropdown
      dropdownRender={renderMenu}
      trigger={MenuTrigger.CLICK}
    >
      <Button>
        {getShortLangCode(i18n.resolvedLanguage)}
      </Button>
    </Dropdown>
  )
}

export {
  LanguageSwitch,
}
