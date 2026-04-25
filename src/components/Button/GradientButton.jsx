
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { PrimaryGradientButton, SecondaryGradientButton } from '@/components/Button/GradientButton.styles'

const GradientButton = (props) => {
  if (props.type === ButtonType.PRIMARY) {
    return (
      <PrimaryGradientButton {...props} />
    )
  }

  return (
    <SecondaryGradientButton {...props} />
  )
}

GradientButton.propTypes = {
  type: PropTypes.string,
}

export {
  GradientButton,
}
