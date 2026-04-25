
import styled from 'styled-components'
import FirstExportOption from '@/assets/images/firstExportOption.png'
import SecondExportOption from '@/assets/images/secondExportOption.png'
import { StyledImage, ImageWithoutText } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const FirstExportImage = styled(ImageWithoutText)`
  background-image: url(${FirstExportOption});  
`

const SecondExportImage = styled(StyledImage)`
  background-image: url(${SecondExportOption});
`

export {
  FirstExportImage,
  SecondExportImage,
}
