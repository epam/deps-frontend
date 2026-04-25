
import PropTypes from 'prop-types'
import { ButtonType, Button } from '@/components/Button'
import { Localization, localize } from '@/localization/i18n'
import {
  SaveButton,
  Wrapper,
} from './EditControlPanel.styles'

const EditControlPanel = ({
  isSavingDisabled,
  onCancel,
  onSave,
  className,
}) => (
  <Wrapper className={className}>
    <Button.Secondary
      onClick={onCancel}
    >
      {localize(Localization.CANCEL)}
    </Button.Secondary>
    <SaveButton
      disabled={isSavingDisabled}
      onClick={onSave}
      type={ButtonType.PRIMARY}
    >
      {localize(Localization.SUBMIT)}
    </SaveButton>
  </Wrapper>
)

EditControlPanel.propTypes = {
  className: PropTypes.string,
  isSavingDisabled: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export {
  EditControlPanel,
}
