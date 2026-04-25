
import { LongText } from '@/components/LongText'
import { Localization, localize } from '@/localization/i18n'
import { BatchInfo } from '../BatchInfo'
import { FilesSwitcher } from '../FilesSwitcher'
import { useFilesSplitting } from '../hooks'
import {
  Wrapper,
  Title,
  ActionsWrapper,
} from './DrawerHeader.styles'

export const DrawerHeader = () => {
  const { splittableFiles, currentFileIndex } = useFilesSplitting()

  return (
    <Wrapper>
      <Title>
        {localize(Localization.ONE_BATCH_SPLITTING)}
      </Title>
      <ActionsWrapper>
        <LongText text={splittableFiles[currentFileIndex]?.source.name} />
        <FilesSwitcher />
        <BatchInfo />
      </ActionsWrapper>
    </Wrapper>
  )
}
