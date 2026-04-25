
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Image,
  Title,
} from './ProcessingReferenceLayout.styles'

const ProcessingReferenceLayout = () => (
  <Wrapper>
    <Image />
    <Title>
      {localize(Localization.REFERENCE_LAYOUT_PROCESSING)}
    </Title>
  </Wrapper>
)

export {
  ProcessingReferenceLayout,
}
