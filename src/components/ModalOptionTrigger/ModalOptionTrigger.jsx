
import PropTypes from 'prop-types'
import {
  Description,
  ItemWrapper,
  Title,
} from './ModalOptionTrigger.styles'

const ModalOptionTrigger = ({
  isDisabled,
  onClick,
  title,
  description,
}) => {
  const handleClick = (e) => {
    if (isDisabled) {
      e.stopPropagation()
      return
    }

    onClick()
  }

  return (
    <ItemWrapper
      $isDisabled={isDisabled}
      onClick={handleClick}
    >
      <Title $isDisabled={isDisabled}>
        {title}
      </Title>
      <Description>
        {description}
      </Description>
    </ItemWrapper>
  )
}

ModalOptionTrigger.propTypes = {
  isDisabled: PropTypes.bool,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export {
  ModalOptionTrigger,
}
