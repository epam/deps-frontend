
import styled from 'styled-components'
import FirstExtractOption from '@/assets/images/extractFirstOption.png'
import SecondExtractOption from '@/assets/images/extractSecondOption.png'
import ThirdExtractOption from '@/assets/images/extractThirdOption.png'
import { StyledImage, LargeImage } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const FirstExtractImage = styled(StyledImage)`
  background-image: url(${FirstExtractOption});
`

const SecondExtractImage = styled(StyledImage)`
  background-image: url(${SecondExtractOption});
`

const ThirdExtractImage = styled(LargeImage)`
  background-image: url(${ThirdExtractOption});
`

export {
  FirstExtractImage,
  SecondExtractImage,
  ThirdExtractImage,
}
