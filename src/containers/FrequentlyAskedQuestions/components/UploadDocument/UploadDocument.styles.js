
import styled from 'styled-components'
import AdditionalUploadImage from '@/assets/images/additionalUpload.png'
import UploadImage from '@/assets/images/uploadDocument.png'
import { StyledImage } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const StyledUploadImage = styled(StyledImage)`  
  background-image: url(${UploadImage});  
`

const StyledAdditionalUploadImage = styled(StyledImage)`
  background-image: url(${AdditionalUploadImage});
`
export {
  StyledUploadImage as UploadImage,
  StyledAdditionalUploadImage as AdditionalUploadImage,
}
