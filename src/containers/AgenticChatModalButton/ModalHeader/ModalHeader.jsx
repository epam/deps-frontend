
import { CompressIcon } from '@/components/Icons/CompressIcon'
import { ExpandIcon } from '@/components/Icons/ExpandIcon'
import { ShortLogoIcon } from '@/components/Icons/ShortLogoIcon'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { Localization, localize } from '@/localization/i18n'
import { useChatSettings } from '../hooks'
import {
  ActionButton,
  Logo,
  ModalTitle,
  Wrapper,
} from './ModalHeader.styles'

const ModalHeader = () => {
  const {
    isExpandedView,
    closeModal,
    toggleExpanded,
  } = useChatSettings()

  return (
    <Wrapper>
      <Logo>
        <ShortLogoIcon />
      </Logo>
      <ModalTitle>
        {localize(Localization.DEPS_AGENT)}
      </ModalTitle>
      <ActionButton
        icon={isExpandedView ? <CompressIcon /> : <ExpandIcon />}
        onClick={toggleExpanded}
      />
      <ActionButton
        icon={<XMarkIcon />}
        onClick={closeModal}
      />
    </Wrapper>
  )
}

export {
  ModalHeader,
}
