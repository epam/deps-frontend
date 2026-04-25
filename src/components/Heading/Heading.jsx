
import PropTypes from 'prop-types'
import { childrenShape } from '@/utils/propTypes'
import { StyledHeading } from './Heading.styles'

const HeadingLevel = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6,
}

const Heading = ({
  level,
  children,
  ...restProps
}) => (
  <StyledHeading
    level={level}
    {...restProps}
  >
    {children}
  </StyledHeading>
)

Heading.propTypes = {
  level: PropTypes.number.isRequired,
  children: childrenShape,
}

export {
  Heading,
  HeadingLevel,
}
