
import PropTypes from 'prop-types'
import { DownOutlined } from '@/components/Icons/DownOutlined'
import { StyledButton, ButtonText } from './TogglerButton.styles'

const TogglerButton = ({ collapsed, title, ...props }) => (
  <StyledButton
    {...props}
  >
    {collapsed ? <DownOutlined /> : <DownOutlined rotate={180} /> }
    <ButtonText>{title}</ButtonText>
  </StyledButton>
)

TogglerButton.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export {
  TogglerButton,
}
