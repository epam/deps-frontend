
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'
import { Button, ButtonType } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { localize, Localization } from '@/localization/i18n'

const MODAL_Z_INDEX = 1002

export const UploadConfirmationButton = ({
  disabled,
  withConfirm,
  onClick,
  onConfirm,
}) => {
  const clickHandler = () => {
    if (withConfirm) {
      Modal.confirm({
        title: localize(Localization.UPLOAD_FILES_CONFORM_MESSAGE),
        onOk: onConfirm,
        zIndex: MODAL_Z_INDEX,
      })

      return
    }

    onClick()
  }

  return (
    <Button
      disabled={disabled}
      onClick={clickHandler}
      type={ButtonType.PRIMARY}
    >
      {localize(Localization.NEXT_STEP)}
    </Button>
  )
}

UploadConfirmationButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onConfirm: isRequiredIf(PropTypes.func, (props) => props.withConfirm),
  withConfirm: PropTypes.bool.isRequired,
}
