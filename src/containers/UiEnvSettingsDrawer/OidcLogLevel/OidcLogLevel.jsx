import PropTypes from 'prop-types'
import { Button, ButtonType } from '@/components/Button'
import { localize, Localization } from '@/localization/i18n'
import { BtnGroup, Label, EnvWrapper } from '../EnvLayout.styles'

const KnownOidcLogLevel = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
}

export const OidcLogLevel = ({ value, envCode, onChange }) => (
  <EnvWrapper>
    <Label>{localize(Localization.OIDC_LOG_LEVEL)}</Label>
    <BtnGroup>
      {
        Object.entries(KnownOidcLogLevel).map(([key, val]) => (
          <Button
            key={key}
            onClick={() => onChange(envCode, val)}
            type={value === val ? ButtonType.PRIMARY : ButtonType.SECONDARY}
          >
            {localize(Localization[key])}
          </Button>
        ))
      }
    </BtnGroup>
  </EnvWrapper>
)

OidcLogLevel.propTypes = {
  envCode: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}
