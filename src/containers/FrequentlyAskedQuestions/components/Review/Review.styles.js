
import styled from 'styled-components'
import ConfidenceLeveImage from '@/assets/images/confidenceLevel.png'
import DocumentReviewImage from '@/assets/images/documentReview.png'
import ModifiedByImage from '@/assets/images/modifiedBy.png'
import ReviewProcessImage from '@/assets/images/reviewProcess.png'
import { StyledImage, LargeImage } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const StyledReviewProcessImage = styled(StyledImage)`
  background-image: url(${ReviewProcessImage});
`

const StyledModifiedByImage = styled(LargeImage)`
  background-image: url(${ModifiedByImage});
`

const StyledConfidenceLevelImage = styled(LargeImage)`
  background-image: url(${ConfidenceLeveImage});
`

const StyledDocumentReviewImage = styled(StyledImage)`
  background-image: url(${DocumentReviewImage});
`

export {
  StyledReviewProcessImage as ReviewProcessImage,
  StyledModifiedByImage as ModifiedByImage,
  StyledConfidenceLevelImage as ConfidenceLevelImage,
  StyledDocumentReviewImage as DocumentReviewImage,
}
