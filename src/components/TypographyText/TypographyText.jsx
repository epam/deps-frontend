import PropTypes from 'prop-types'
import { childrenShape } from '@/utils/propTypes'
import { StyledText } from './TypographyText.styles'

const TypographyText = ({ content, editable, ...rest }) => (
  <StyledText
    editable={editable}
    {...rest}
  >
    {content}
  </StyledText>
)

TypographyText.propTypes = {
  content: PropTypes.string.isRequired,
  editable: PropTypes.oneOfType([
    PropTypes.shape({
      onChange: PropTypes.func,
      enterIcon: childrenShape,
    }),
    PropTypes.bool,
  ]),
}

export {
  TypographyText,
}
