
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { retryLastStep } from '@/actions/documentReviewPage'
import { ALLOW_TO_RETRY_LAST_STEP_STATES } from '@/constants/document'
import { RetryPreviousStepButton } from '@/containers/RetryPreviousStepButton'
import { RESOURCE_DOCUMENT_STATE } from '@/enums/DocumentState'
import { Localization, localize } from '@/localization/i18n'
import { documentErrorShape } from '@/models/Document'
import { ENV } from '@/utils/env'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import {
  Button,
  Description,
  ErrorIcon,
  Message,
  RetryIcon,
  Title,
  Wrapper,
} from './ErrorMessage.styles'

const ErrorMessage = ({
  documentId,
  error,
  state,
}) => {
  const dispatch = useDispatch()

  const retryAction = async () => {
    try {
      await dispatch(retryLastStep(documentId))
      notifySuccess(localize(Localization.RETRY_LAST_STEP_SUCCESS, { stepNumber: RESOURCE_DOCUMENT_STATE[error.inState] }))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }

  const renderTrigger = (onClick) => (
    <Button
      icon={<RetryIcon />}
      onClick={onClick}
    />
  )

  return (
    <Wrapper>
      <Message>
        <ErrorIcon />
        <Title>
          {localize(Localization.ERROR_IN_STATE, { state: RESOURCE_DOCUMENT_STATE[error.inState] })}
        </Title>
        <Description text={error.description} />
      </Message>
      {
        ENV.FEATURE_RETRY_PREVIOUS_STEP &&
        ALLOW_TO_RETRY_LAST_STEP_STATES.includes(state) && (
          <RetryPreviousStepButton
            confirmContent={localize(Localization.RETRY_LAST_STEP_CONFIRM_CONTENT, { stepNumber: RESOURCE_DOCUMENT_STATE[error.inState] })}
            renderTrigger={renderTrigger}
            retryLastStep={retryAction}
          />
        )
      }
    </Wrapper>
  )
}

ErrorMessage.propTypes = {
  documentId: PropTypes.string.isRequired,
  error: documentErrorShape.isRequired,
  state: PropTypes.string.isRequired,
}

export {
  ErrorMessage,
}
