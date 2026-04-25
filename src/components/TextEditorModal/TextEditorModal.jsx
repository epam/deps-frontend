
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import stylePropType from 'react-style-proptype'
import { CheckIcon } from '@/components/Icons/CheckIcon'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { Tooltip } from '@/components/Tooltip'
import { Localization, localize } from '@/localization/i18n'
import {
  SubmitButton,
  CancelButton,
  Input,
  Modal,
  Container,
  Wrapper,
  ErrorMessage,
} from './TextEditorModal.styles'

const setFocus = (el) => {
  setTimeout(() => {
    el.current?.focus()
  })
}

const MODAL_WRAPPER_CLASSNAME = 'modal-wrapper'
const INPUT_MAX_LENGTH = 255

const TEST_ID = {
  TEXT_EDITOR_MODAL_INPUT: 'text-editor-modal-input',
  TEXT_EDITOR_MODAL_SUBMIT: 'text-editor-modal-submit',
  TEXT_EDITOR_MODAL_CANCEL: 'text-editor-modal-cancel',
}

const TextEditorModal = ({
  addonAfter,
  getContainer,
  isLoading,
  maxLength,
  onCancel,
  onSubmit,
  placeholder,
  style,
  value,
  validationError,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    setFocus(inputRef)
  }, [])

  const onInputChange = useCallback((e) => {
    setInputValue(e.target.value.trimStart())
  }, [setInputValue])

  const onCancelButtonClick = useCallback(() => {
    setInputValue(value)
    onCancel()
  }, [
    onCancel,
    setInputValue,
    value,
  ])

  const onSubmitHandler = useCallback((e) => {
    e.preventDefault()

    const value = inputValue.trim()

    if (!value?.length) {
      return
    }

    onSubmit(value)
  }, [
    inputValue,
    onSubmit,
  ])

  const onModalCancel = async (e) => {
    const container = e.target

    if (container.classList.contains(MODAL_WRAPPER_CLASSNAME) && inputValue) {
      await onSubmit(inputValue.trim())
    }

    onCancel()
  }

  const Content = useMemo(() => (
    <Container>
      <Wrapper onSubmit={onSubmitHandler}>
        <Input
          addonAfter={addonAfter}
          data-testid={TEST_ID.TEXT_EDITOR_MODAL_INPUT}
          innerRef={inputRef}
          maxLength={maxLength ?? INPUT_MAX_LENGTH}
          onChange={onInputChange}
          placeholder={placeholder}
          value={inputValue}
        />
        <Tooltip title={localize(Localization.CANCEL)}>
          <CancelButton
            data-testid={TEST_ID.TEXT_EDITOR_MODAL_CANCEL}
            disabled={isLoading}
            icon={<XMarkIcon />}
            onClick={onCancelButtonClick}
          />
        </Tooltip>
        <Tooltip title={localize(Localization.SUBMIT)}>
          <SubmitButton
            data-testid={TEST_ID.TEXT_EDITOR_MODAL_SUBMIT}
            disabled={!inputValue?.length}
            icon={<CheckIcon />}
            loading={isLoading}
            onClick={onSubmitHandler}
          />
        </Tooltip>
      </Wrapper>
      {
        validationError &&
        <ErrorMessage>{validationError}</ErrorMessage>
      }
    </Container>
  ), [
    addonAfter,
    onCancelButtonClick,
    onSubmitHandler,
    inputValue,
    isLoading,
    maxLength,
    onInputChange,
    placeholder,
    validationError,
  ])

  return (
    <Modal
      closable={false}
      destroyOnClose
      footer={null}
      getContainer={getContainer}
      maskClosable
      onCancel={onModalCancel}
      open
      style={style}
      wrapClassName={MODAL_WRAPPER_CLASSNAME}
    >
      {Content}
    </Modal>
  )
}

TextEditorModal.propTypes = {
  addonAfter: PropTypes.string,
  getContainer: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  maxLength: PropTypes.number,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  style: stylePropType,
  value: PropTypes.string,
  validationError: PropTypes.string,
}

export {
  TextEditorModal,
}
