
import PropTypes from 'prop-types'
import { Button, ButtonType } from '@/components/Button'
import { Localization, localize } from '@/localization/i18n'
import { Wrapper, CancelButton } from './Footer.styles'

export const Footer = ({
  onClear,
  onCancel,
  onSave,
  isSaveDisabled,
}) => (
  <Wrapper>
    <Button
      onClick={onClear}
      type={ButtonType.LINK}
    >
      {localize(Localization.RESET)}
    </Button>
    {
      onCancel && (
        <CancelButton onClick={onCancel}>
          {localize(Localization.CANCEL)}
        </CancelButton>
      )
    }
    {
      onSave && (
        <Button
          disabled={isSaveDisabled}
          onClick={onSave}
          type={ButtonType.PRIMARY}
        >
          {localize(Localization.SAVE)}
        </Button>
      )
    }
  </Wrapper>
)

Footer.propTypes = {
  onClear: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  isSaveDisabled: PropTypes.bool.isRequired,
}
