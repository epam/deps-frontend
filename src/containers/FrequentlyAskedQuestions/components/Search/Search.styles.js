
import styled from 'styled-components'
import AddLabelImage from '@/assets/images/addLabel.png'
import DocumentLabelImage from '@/assets/images/documentLabel.png'
import FiltersImage from '@/assets/images/filters.png'
import KeywordSearchImage from '@/assets/images/keywordSearch.png'
import LabelAdditionImage from '@/assets/images/labelAddition.png'
import LabelFilterImage from '@/assets/images/labelFilter.png'
import TitleSearchImage from '@/assets/images/titleSearch.png'
import { StyledImage, LargeImage } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const StyledKeywordSearchImage = styled(LargeImage)`
  background-image: url(${KeywordSearchImage});  
`

const StyledTitleSearchImage = styled(LargeImage)`
  background-image: url(${TitleSearchImage});  
`

const StyledFiltersImage = styled(LargeImage)`
  background-image: url(${FiltersImage});
  height: 35rem;
`

const StyledAddLabelImage = styled(StyledImage)`
  background-image: url(${AddLabelImage});
  height: 30rem;
`

const StyledLabelAdditionImage = styled(StyledImage)`
  background-image: url(${LabelAdditionImage});  
`

const StyledDocumentLabelImage = styled(StyledImage)`
  background-image: url(${DocumentLabelImage});
  height: 20rem;
`

const StyledLabelFilterImage = styled(StyledImage)`
  background-image: url(${LabelFilterImage});  
`

export {
  StyledKeywordSearchImage as KeywordSearchImage,
  StyledTitleSearchImage as TitleSearchImage,
  StyledFiltersImage as FiltersImage,
  StyledAddLabelImage as AddLabelImage,
  StyledLabelAdditionImage as LabelAdditionImage,
  StyledDocumentLabelImage as DocumentLabelImage,
  StyledLabelFilterImage as LabelFilterImage,
}
