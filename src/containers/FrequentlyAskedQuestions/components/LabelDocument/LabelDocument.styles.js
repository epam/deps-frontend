
import styled from 'styled-components'
import AssignLabelImage from '@/assets/images/assignLabel.png'
import LabelImage from '@/assets/images/label.png'
import LabelSelectionImage from '@/assets/images/labelSelection.png'
import MarkupUpdateImage from '@/assets/images/markupUpdate.png'
import OpenLtImage from '@/assets/images/openLt.png'
import PointerImage from '@/assets/images/pointer.png'
import SaveImage from '@/assets/images/save.png'
import SelectedLabelImage from '@/assets/images/selectedLabel.png'
import { ExtraLargeImage, SmallSideImage, LargeSideImage } from '@/containers/FrequentlyAskedQuestions/components/Image.styles'

const StyledOpenLtImage = styled(ExtraLargeImage)`
  background-image: url(${OpenLtImage});
`

const StyledLabelImage = styled(ExtraLargeImage)`
  background-image: url(${LabelImage});
`

const StyledPointerImage = styled(ExtraLargeImage)`
  background-image: url(${PointerImage});
`

const StyledLabelSelectionImage = styled(LargeSideImage)`
  background-image: url(${LabelSelectionImage});  
`

const StyledSelectedLabelImage = styled(SmallSideImage)`
  background-image: url(${SelectedLabelImage});
  height: 10rem; 
`

const StyledAssignLabelImage = styled(ExtraLargeImage)`
  background-image: url(${AssignLabelImage});  
`

const StyledSaveImage = styled(ExtraLargeImage)`
  background-image: url(${SaveImage});
`

const StyledMarkupUpdateImage = styled(ExtraLargeImage)`
  background-image: url(${MarkupUpdateImage});
`

export {
  StyledOpenLtImage as OpenLtImage,
  StyledLabelImage as LabelImage,
  StyledPointerImage as PointerImage,
  StyledLabelSelectionImage as LabelSelectionImage,
  StyledSelectedLabelImage as SelectedLabelImage,
  StyledAssignLabelImage as AssignLabelImage,
  StyledSaveImage as SaveImage,
  StyledMarkupUpdateImage as MarkupUpdateImage,
}
