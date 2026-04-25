
import PropTypes from 'prop-types'
import { Image, Title, Wrapper } from './EmptyState.styles'

const EmptyState = ({ title }) => (
  <Wrapper>
    <Image />
    <Title>{title}</Title>
  </Wrapper>
)

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
}

export { EmptyState }
