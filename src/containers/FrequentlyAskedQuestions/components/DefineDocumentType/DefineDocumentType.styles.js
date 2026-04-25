
import styled from 'styled-components'
import StateImage from '@/assets/images/documentState.png'
import DocumentTypeImage from '@/assets/images/documentType.png'
import UnknownTypeImage from '@/assets/images/unknownDocumentType.png'
import { StyledImage, ImageWithoutText } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const StyledStateImage = styled(ImageWithoutText)`
  background-image: url(${StateImage});  
`

const StyledDocumentTypeImage = styled(StyledImage)`
  background-image: url(${DocumentTypeImage});
`

const StyledUnknownTypeImage = styled(StyledImage)`
  background-image: url(${UnknownTypeImage});
`
export {
  StyledStateImage as StateImage,
  StyledDocumentTypeImage as DocumentTypeImage,
  StyledUnknownTypeImage as UnknownTypeImage,
}
