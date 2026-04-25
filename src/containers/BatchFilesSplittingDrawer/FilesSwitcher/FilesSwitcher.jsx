
import { LeftIcon } from '@/components/Icons/LeftIcon'
import { RightIcon } from '@/components/Icons/RightIcon'
import { Localization, localize } from '@/localization/i18n'
import { useFilesSplitting } from '../hooks'
import { getTooltipConfig } from '../utils'
import { IconButton, SwitcherWrapper } from './FilesSwitcher.styles'

export const FilesSwitcher = () => {
  const {
    currentFileIndex,
    setCurrentFileIndex,
    splittableFiles,
  } = useFilesSplitting()

  const onPrevious = () => {
    setCurrentFileIndex(currentFileIndex - 1)
  }

  const onNext = () => {
    setCurrentFileIndex(currentFileIndex + 1)
  }

  return (
    <SwitcherWrapper>
      <IconButton
        disabled={currentFileIndex === 0}
        icon={<LeftIcon />}
        onClick={onPrevious}
        tooltip={getTooltipConfig(localize(Localization.PREVIOUS_FILE))}
      />
      <IconButton
        disabled={currentFileIndex === splittableFiles.length - 1}
        icon={<RightIcon />}
        onClick={onNext}
        tooltip={getTooltipConfig(localize(Localization.NEXT_FILE))}
      />
    </SwitcherWrapper>
  )
}
