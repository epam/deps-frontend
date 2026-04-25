
import styled from 'styled-components'
import ValidationImage from '@/assets/images/validation.png'
import { StyledImage } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const StyledValidationImage = styled(StyledImage)`
  background-image: url(${ValidationImage});
`

export {
  StyledValidationImage as ValidationImage,
}
