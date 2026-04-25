
import lodashDebounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useValidateAzureExtractorCredentialsMutation } from '@/apiRTK/documentTypeApi'
import { CheckCircleIcon } from '@/components/Icons/CheckCircleIcon'
import { ErrorIcon } from '@/components/Icons/ErrorIcon'
import { GoToAzureButton } from '@/containers/GoToAzureButton'
import { localize, Localization } from '@/localization/i18n'
import { azureCredentialsShape } from '@/models/AzureExtractor'
import {
  Message,
  Wrapper,
} from './AzureCredentialsValidator.styles'

const VALIDATION_STATES = {
  NOT_APPLIED: 'notApplied',
  IN_PROGRESS: 'inProgress',
  ERROR: 'error',
  SUCCESS: 'success',
}

const VALIDATION_STATES_MESSAGES = {
  [VALIDATION_STATES.NOT_APPLIED]: localize(Localization.CONNECTION_NOT_VALIDATED),
  [VALIDATION_STATES.IN_PROGRESS]: localize(Localization.CONNECTION_VALIDATION_PROGRESS),
  [VALIDATION_STATES.ERROR]: localize(Localization.CONNECTION_VALIDATION_ERROR),
  [VALIDATION_STATES.SUCCESS]: localize(Localization.CONNECTION_VALIDATION_SUCCESS),
}

const VALIDATION_STATES_ICONS = {
  [VALIDATION_STATES.ERROR]: ErrorIcon,
  [VALIDATION_STATES.SUCCESS]: CheckCircleIcon,
}

const DEBOUNCE_TIME = 300

const normalizeCredentials = ({ apiKey, endpoint, modelId }) => ({
  apiKey: apiKey?.trim(),
  endpoint: endpoint?.trim(),
  modelId: modelId?.trim(),
})

const AzureCredentialsValidator = ({
  credentials,
  setAreCredentialsValid,
}) => {
  const [validationState, setValidationState] = useState(VALIDATION_STATES.NOT_APPLIED)

  const { apiKey, endpoint, modelId } = normalizeCredentials(credentials)

  const [
    validateAzureExtractorCredentials,
    { isLoading },
  ] = useValidateAzureExtractorCredentialsMutation()

  const validateData = useCallback(async ({ apiKey, endpoint, modelId }) => {
    try {
      await validateAzureExtractorCredentials({
        apiKey,
        endpoint,
        modelId,
      }).unwrap()

      setValidationState(VALIDATION_STATES.SUCCESS)
      setAreCredentialsValid(true)
    } catch (e) {
      setValidationState(VALIDATION_STATES.ERROR)
      setAreCredentialsValid(false)
    }
  }, [
    setAreCredentialsValid,
    validateAzureExtractorCredentials,
  ])

  const debouncedValidation = useMemo(
    () => lodashDebounce(
      (data) => validateData(data),
      DEBOUNCE_TIME,
    ), [validateData],
  )

  useEffect(() => {
    const shouldValidate = apiKey &&
      endpoint &&
      modelId

    if (!shouldValidate) {
      return
    }

    debouncedValidation({
      apiKey,
      endpoint,
      modelId,
    })
  }, [
    apiKey,
    endpoint,
    modelId,
    debouncedValidation,
  ])

  const renderValidationMessage = () => {
    if (isLoading) {
      setAreCredentialsValid(false)

      return (
        <Message>
          {VALIDATION_STATES_MESSAGES[VALIDATION_STATES.IN_PROGRESS]}
        </Message>
      )
    }

    const Icon = VALIDATION_STATES_ICONS[validationState]

    return (
      <Message>
        {Icon && <Icon />}
        {VALIDATION_STATES_MESSAGES[validationState]}
      </Message>
    )
  }

  return (
    <Wrapper
      $inProgress={isLoading}
    >
      {renderValidationMessage()}
      <GoToAzureButton
        text={localize(Localization.GO_TO_AZURE)}
      />
    </Wrapper>
  )
}

AzureCredentialsValidator.propTypes = {
  credentials: azureCredentialsShape.isRequired,
  setAreCredentialsValid: PropTypes.func.isRequired,
}

export {
  AzureCredentialsValidator,
}
