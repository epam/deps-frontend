
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { ArrowRightOutlined } from '@/components/Icons/ArrowRightOutlined'
import { PlusFilledIcon } from '@/components/Icons/PlusFilledIcon'
import { Localization, localize } from '@/localization/i18n'
import {
  IconWrapper,
  Button,
  LogoWrapper,
  TextButton,
  StorageIconWrapper,
  TextWrapper,
} from './StorageButton.styles'

const StorageButton = ({
  isActive,
  onClick,
  storageName,
  icon,
  disabled,
  title,
}) => {
  if (isActive) {
    return (
      <TextButton
        disabled={disabled}
        onClick={onClick}
        title={title}
        type={ButtonType.GHOST}
      >
        <StorageIconWrapper>
          {icon}
        </StorageIconWrapper>
        <TextWrapper>
          <PlusFilledIcon />
          {localize(Localization.STORAGE_DOCUMENTS, { storageName })}
        </TextWrapper>
      </TextButton>
    )
  }

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      title={title}
      type={ButtonType.GHOST}
    >
      <LogoWrapper>
        {icon}
      </LogoWrapper>
      {storageName}
      <IconWrapper>
        <ArrowRightOutlined />
      </IconWrapper>
    </Button>
  )
}

StorageButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  storageName: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  title: PropTypes.string,
}

export {
  StorageButton,
}
