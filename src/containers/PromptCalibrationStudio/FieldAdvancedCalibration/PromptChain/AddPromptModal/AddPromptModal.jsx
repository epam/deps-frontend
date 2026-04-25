
import PropTypes from 'prop-types'
import {
  useState,
  useMemo,
  useCallback,
} from 'react'
import { Button, ButtonType } from '@/components/Button'
import { Input } from '@/components/Input'
import { Tooltip } from '@/components/Tooltip'
import { queryNodeShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import {
  InputWrapper,
  StyledModal,
  TextArea,
  Wrapper,
} from './AddPromptModal.styles'

const MODAL_WIDTH = '50vw'

export const AddPromptModal = ({
  onClose,
  onSave,
  node,
}) => {
  const [name, setName] = useState(node?.name || '')
  const [value, setValue] = useState(node?.prompt || '')
  const [isHovered, setIsHovered] = useState(false)

  const onCloseHandler = useCallback(() => {
    setName('')
    setValue('')
    onClose()
  }, [onClose])

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const onChangeValue = (e) => {
    setValue(e.target.value)
  }

  const onSaveHandler = useCallback(() => {
    onSave(name, value)
  }, [onSave, name, value])

  const isSaveDisabled = !name || !value

  const onKeyDown = useCallback((e) => {
    if (e.shiftKey && e.key === 'Enter' && !isSaveDisabled) {
      e.preventDefault()
      onSaveHandler()
    }
  }, [isSaveDisabled, onSaveHandler])

  const saveTooltipTitle = isSaveDisabled
    ? null
    : localize(Localization.SHIFT_ENTER_SHORTCUT_HINT)

  const Footer = useMemo(() => (
    <Wrapper>
      <Button.Secondary onClick={onCloseHandler}>
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Tooltip
        open={!!saveTooltipTitle && isHovered}
        title={saveTooltipTitle}
      >
        <Button
          disabled={isSaveDisabled}
          onClick={onSaveHandler}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          type={ButtonType.PRIMARY}
        >
          {localize(Localization.SAVE)}
        </Button>
      </Tooltip>
    </Wrapper>
  ), [
    onCloseHandler,
    onSaveHandler,
    isSaveDisabled,
    saveTooltipTitle,
    isHovered,
  ])

  return (
    <StyledModal
      centered
      closable={false}
      destroyOnClose
      footer={Footer}
      maskClosable={false}
      onCancel={onCloseHandler}
      open
      title={null}
      width={MODAL_WIDTH}
    >
      <InputWrapper>
        <Input
          onChange={onChangeName}
          placeholder={localize(Localization.ENTER_PROMPT_NAME)}
          value={name}
        />
      </InputWrapper>
      <TextArea
        onChange={onChangeValue}
        onKeyDown={onKeyDown}
        placeholder={localize(Localization.ENTER_PROMPT_VALUE)}
        value={value}
      />
    </StyledModal>
  )
}

AddPromptModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  node: queryNodeShape,
}
