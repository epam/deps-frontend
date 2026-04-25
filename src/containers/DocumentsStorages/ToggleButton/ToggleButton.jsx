
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { localize, Localization } from '@/localization/i18n'
import {
  ButtonWrapper,
  Button,
} from './ToggleButton.styles'

const ToggleButton = ({
  toggleView,
  isCollapsed,
  documentsCount,
}) => {
  const getButtonContent = () => {
    if (isCollapsed) {
      return localize(Localization.SHOW_ALL, { count: documentsCount })
    }

    return localize(Localization.COLLAPSE)
  }

  return (
    <ButtonWrapper>
      <Button
        onClick={toggleView}
        type={ButtonType.GHOST}
      >
        {getButtonContent()}
      </Button>
    </ButtonWrapper>
  )
}

ToggleButton.propTypes = {
  toggleView: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  documentsCount: PropTypes.number.isRequired,
}

export {
  ToggleButton,
}
