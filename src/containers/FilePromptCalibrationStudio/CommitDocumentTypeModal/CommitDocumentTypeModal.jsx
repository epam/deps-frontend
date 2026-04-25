
import lodashDebounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { Button, ButtonType } from '@/components/Button'
import { FieldLabel } from '@/components/FieldLabel'
import { Modal } from '@/components/Modal'
import { Spin } from '@/components/Spin'
import { localize, Localization } from '@/localization/i18n'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'
import {
  ModalTitle,
  ModalContent,
  Footer,
  StyledInput,
  ErrorMessage,
  InfoMessage,
} from './CommitDocumentTypeModal.styles'

const DEBOUNCE_TIME = 250
const MODAL_WIDTH = 480

export const CommitDocumentTypeModal = ({
  onCommit,
  isDisabled,
  isLoading,
  isVisible,
  toggleModalVisibility,
}) => {
  const [documentTypeName, setDocumentTypeName] = useState('')
  const [isValidationError, setIsValidationError] = useState(false)

  const areDocumentTypesFetching = useSelector(areTypesFetchingSelector)
  const documentTypes = useSelector(documentTypesSelector)

  const dispatch = useDispatch()

  const validateDocumentTypeName = useCallback((documentTypeName) => {
    const isNameInvalid = documentTypes.some(({ name }) => documentTypeName === name)
    setIsValidationError(isNameInvalid)
  }, [documentTypes])

  const debouncedOnChange = useMemo(() => (
    lodashDebounce(
      (value) => validateDocumentTypeName(value),
      DEBOUNCE_TIME,
    )
  ), [validateDocumentTypeName])

  useEffect(() => {
    !documentTypes.length && dispatch(fetchDocumentTypes())

    return () => debouncedOnChange.cancel()
  }, [
    debouncedOnChange,
    dispatch,
    documentTypes.length,
  ])

  const handleNameChange = useCallback((e) => {
    const value = e.target.value.trimStart()

    setDocumentTypeName(value)
    debouncedOnChange(value)
  }, [debouncedOnChange])

  const handleCancel = useCallback(() => {
    debouncedOnChange.cancel()
    setDocumentTypeName('')
    setIsValidationError(false)
    toggleModalVisibility()
  }, [debouncedOnChange, toggleModalVisibility])

  const handleSave = useCallback(async () => {
    if (isValidationError) {
      return
    }

    onCommit(documentTypeName)
  }, [
    documentTypeName,
    isValidationError,
    onCommit,
  ])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !isValidationError && documentTypeName.trim()) {
      handleSave()
    }
  }, [
    documentTypeName,
    isValidationError,
    handleSave,
  ])

  const FooterComponent = useMemo(() => (
    <Footer>
      <Button.Secondary
        disabled={isLoading}
        onClick={handleCancel}
      >
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        disabled={!documentTypeName.trim() || isValidationError}
        loading={isLoading}
        onClick={handleSave}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.CONFIRM)}
      </Button>
    </Footer>
  ), [
    isLoading,
    handleCancel,
    documentTypeName,
    handleSave,
    isValidationError,
  ])

  const Title = useMemo(() => (
    <ModalTitle>
      {localize(Localization.CONFIRM_SAVE_TO_DOCUMENT_TYPE)}
    </ModalTitle>
  ), [])

  return (
    <>
      <Button
        disabled={isDisabled}
        onClick={toggleModalVisibility}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE_TO_DOCUMENT_TYPE)}
      </Button>
      <Modal
        centered
        closable={false}
        destroyOnClose
        footer={FooterComponent}
        keyboard={false}
        maskClosable={false}
        onCancel={handleCancel}
        open={isVisible}
        title={Title}
        width={MODAL_WIDTH}
      >
        <Spin spinning={areDocumentTypesFetching}>
          <ModalContent>
            <InfoMessage>
              {localize(Localization.DOCUMENT_TYPE_COMMIT_INFO_MESSAGE)}
            </InfoMessage>
            <FieldLabel name={localize(Localization.DOCUMENT_TYPE_NAME)} />
            <StyledInput
              autoFocus
              disabled={isLoading}
              onChange={handleNameChange}
              onPressEnter={handleKeyPress}
              placeholder={localize(Localization.DOCUMENT_TYPE_NAME_TEXT)}
              value={documentTypeName}
            />
            <ErrorMessage $error={isValidationError}>
              {localize(Localization.DOCUMENT_TYPE_NAME_ALREADY_EXISTS)}
            </ErrorMessage>
          </ModalContent>
        </Spin>
      </Modal>
    </>
  )
}

CommitDocumentTypeModal.propTypes = {
  onCommit: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModalVisibility: PropTypes.func.isRequired,
}
