
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { localize, Localization } from '@/localization/i18n'

const RetryPreviousStepButton = ({
  disabled,
  confirmContent,
  retryLastStep,
  renderTrigger,
}) => {
  const showConfirm = () => {
    Modal.confirm({
      title: localize(Localization.RETRY_LAST_STEP_CONFIRM_TITLE),
      content: confirmContent,
      okText: localize(Localization.RETRY),
      cancelText: localize(Localization.CANCEL),
      onOk: retryLastStep,
    })
  }

  if (renderTrigger) {
    return renderTrigger(showConfirm)
  }

  return (
    <Button.Text
      disabled={disabled}
      onClick={showConfirm}
    >
      {localize(Localization.RETRY_PREVIOUS_STEP)}
    </Button.Text>
  )
}

RetryPreviousStepButton.propTypes = {
  confirmContent: PropTypes.string,
  disabled: PropTypes.bool,
  retryLastStep: PropTypes.func.isRequired,
  renderTrigger: PropTypes.func,
}

export {
  RetryPreviousStepButton,
}
