
import { forwardRef } from 'react'
import { StyledButton } from './Button.styles'

const Button = forwardRef((props, ref) => (
  <StyledButton
    ref={ref}
    {...props}
  />
))

export {
  Button,
}
