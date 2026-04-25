
import { Localization, localize } from '@/localization/i18n'
import { MAX_FILES_COUNT_FOR_ONE_BATCH } from '../constants'
import { useFilesSplitting } from '../hooks'
import { getCurrentFilesCount } from '../utils'
import { Counter, Wrapper } from './FilesCounter.styles'

const SEPARATOR = ' / '

export const FilesCounter = () => {
  const { splittableFiles, batchFiles } = useFilesSplitting()

  const currentFilesCount = getCurrentFilesCount(splittableFiles, batchFiles.length)

  return (
    <Wrapper>
      {localize(Localization.BATCH_FILES_NUMBER)}
      <Counter $isError={currentFilesCount > MAX_FILES_COUNT_FOR_ONE_BATCH}>
        {currentFilesCount}
        {SEPARATOR}
        {MAX_FILES_COUNT_FOR_ONE_BATCH}
      </Counter>
    </Wrapper>
  )
}
