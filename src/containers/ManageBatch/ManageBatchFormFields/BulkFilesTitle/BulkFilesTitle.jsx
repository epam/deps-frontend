
import { Localization, localize } from '@/localization/i18n'
import {
  FirstLine,
  SecondLine,
  BulkFilesTitleWrapper,
  CircleExclamationIcon,
} from './BulkFilesTitle.styles'

export const BulkFilesTitle = () => (
  <BulkFilesTitleWrapper>
    <FirstLine>
      {localize(Localization.FILES_PROPERTIES)}
    </FirstLine>
    <SecondLine>
      <CircleExclamationIcon />
      {localize(Localization.BULK_FILES_DESCRIPTION)}
    </SecondLine>
  </BulkFilesTitleWrapper>
)
