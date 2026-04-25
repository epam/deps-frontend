
import { Button } from './Button'
import { ButtonType } from './ButtonType'
import { GradientButton } from './GradientButton'
import { IconButton } from './IconButton'
import { LinkButton } from './LinkButton'
import { SecondaryButton } from './SecondaryButton'
import { TextButton } from './TextButton.styles'

Button.Link = LinkButton
Button.Gradient = GradientButton
Button.Secondary = SecondaryButton
Button.Icon = IconButton
Button.Text = TextButton

export {
  Button,
  ButtonType,
}
