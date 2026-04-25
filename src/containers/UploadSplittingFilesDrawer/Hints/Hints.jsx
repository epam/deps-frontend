
import { FILE_EXTENSION_TO_DISPLAY_TEXT, FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { MAX_FILES_COUNT_FOR_ONE_BATCH } from '../constants'
import {
  FormatsList,
  HintWrapper,
  StyledExclamationIcon,
  Wrapper,
} from './Hints.styles'

const FILES_FORMATS = [
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.DOCX],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.XLSX],
  FILE_EXTENSION_TO_DISPLAY_TEXT[FileExtension.CSV],
]

export const Hints = () => (
  <Wrapper>
    <HintWrapper>
      <StyledExclamationIcon />
      <FormatsList>
        {FILES_FORMATS.join('; ')}
      </FormatsList>
      {localize(Localization.FILES_HAVE_NATIVE_PARSING)}
    </HintWrapper>
    <HintWrapper>
      <StyledExclamationIcon />
      {localize(Localization.ONE_BATCH_MAX_FILES, { maxFiles: MAX_FILES_COUNT_FOR_ONE_BATCH })}
    </HintWrapper>
  </Wrapper>
)
