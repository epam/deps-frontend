
import { FILE_EXTENSION_TO_DISPLAY_TEXT, FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import {
  FormatsList,
  StyledExclamationIcon,
  Wrapper,
} from './Hint.styles'

const FILES_FORMATS = [
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.DOCX],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.XLSX],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.CSV],
]

export const Hint = () => (
  <Wrapper>
    <StyledExclamationIcon />
    <FormatsList>
      {FILES_FORMATS.join('; ')}
    </FormatsList>
    {localize(Localization.FILES_HAVE_NATIVE_PARSING)}
  </Wrapper>
)
