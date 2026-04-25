
import { Input } from '@/components/Input'
import { usePdfSegments } from '@/containers/PdfSplitting/hooks'
import { Localization, localize } from '@/localization/i18n'
import {
  StyledFieldLabel,
  InputWrapper,
} from './BatchNameInput.styles'

export const BatchNameInput = () => {
  const { setBatchName, batchName } = usePdfSegments()

  const onChangeHandler = (e) => {
    setBatchName(e.target.value)
  }

  return (
    <InputWrapper>
      <StyledFieldLabel
        name={localize(Localization.BATCH_NAME)}
        required
      />
      <Input
        name={localize(Localization.BATCH_NAME)}
        onChange={onChangeHandler}
        placeholder={localize(Localization.ENTER_BATCH_NAME)}
        value={batchName}
      />
    </InputWrapper>
  )
}
