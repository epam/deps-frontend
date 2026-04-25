
import {
  useMemo,
  useState,
  useCallback,
} from 'react'
import { ButtonType } from '@/components/Button/ButtonType'
import { CloudDownloadIcon } from '@/components/Icons/CloudDownloadIcon'
import { Popover, PopoverTrigger } from '@/components/Popover'
import { Localization, localize } from '@/localization/i18n'
import { UPLOAD_ENTITIES_POPOVER_CLASS_NAME } from './constants'
import { UploadTypeToOptions, UploadTypeToRender } from './mappers'
import {
  PopoverContainer,
  PopoverTitle,
  OptionsList,
  OptionItem,
  OptionTitle,
  OptionDescription,
  StyledButton,
  IconWrapper,
} from './UploadEntities.styles.js'

export const UploadEntities = () => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [activeUploadType, setActiveUploadType] = useState(null)

  const onOptionClick = useCallback((uploadType) => {
    setActiveUploadType(uploadType)
    setIsDrawerVisible(true)
    setIsPopoverVisible(false)
  }, [])

  const onDrawerClose = useCallback(() => {
    setIsDrawerVisible(false)
  }, [])

  const onPopoverVisibleChange = (visible) => {
    setIsPopoverVisible(visible)
  }

  const ButtonIcon = useMemo(() => (
    <IconWrapper>
      <CloudDownloadIcon />
    </IconWrapper>
  ), [])

  const Content = useMemo(() => (
    <PopoverContainer>
      <PopoverTitle>
        {localize(Localization.TYPE_OF_UPLOAD)}
      </PopoverTitle>
      <OptionsList>
        {
          Object.entries(UploadTypeToOptions).map(([uploadType, option]) => (
            <OptionItem
              key={uploadType}
              disabled={option.disabled}
              onClick={() => onOptionClick(uploadType)}
            >
              <OptionTitle>
                {option.title}
              </OptionTitle>
              <OptionDescription>
                {option.description}
              </OptionDescription>
            </OptionItem>
          ))
        }
      </OptionsList>
    </PopoverContainer>
  ), [onOptionClick])

  const Drawer = UploadTypeToRender[activeUploadType] ?? (() => null)

  return (
    <>
      <Popover
        content={Content}
        onOpenChange={onPopoverVisibleChange}
        open={isPopoverVisible}
        overlayClassName={UPLOAD_ENTITIES_POPOVER_CLASS_NAME}
        trigger={PopoverTrigger.CLICK}
      >
        <StyledButton
          icon={ButtonIcon}
          type={ButtonType.PRIMARY}
        >
          {localize(Localization.UPLOAD_FILES)}
        </StyledButton>
      </Popover>
      <Drawer
        isVisible={isDrawerVisible}
        onClose={onDrawerClose}
      />
    </>
  )
}
