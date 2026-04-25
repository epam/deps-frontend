
import PropTypes from 'prop-types'
import { childrenShape } from '@/utils/propTypes'
import {
  Wrapper,
  IconWrapper,
  Title,
  Count,
} from './Card.styles'

const Card = ({
  icon,
  title,
  count,
  onClick,
}) => (
  <Wrapper onClick={onClick}>
    <IconWrapper>
      {icon}
    </IconWrapper>
    <Title>
      {title}
      <Count>
        {count}
      </Count>
    </Title>
  </Wrapper>
)

Card.propTypes = {
  icon: childrenShape,
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onClick: PropTypes.func.isRequired,
}

export {
  Card,
}
