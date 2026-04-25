
import { RadioOption } from '@/components/Radio/RadioOption'
import { localize, Localization } from '@/localization/i18n'
import { BATCH_TYPE } from '../constants'
import { StyledDualToggle } from './BatchTypeSwitcher.styles'

const batchTypeOptions = [
  new RadioOption({
    value: BATCH_TYPE.ONE_BATCH,
    text: localize(Localization.ONE_BATCH),
  }),
  new RadioOption({
    value: BATCH_TYPE.MULTI_BATCHES,
    text: localize(Localization.MULTI_BATCHES),
  }),
]

export const BatchTypeSwitcher = (props) => (
  <StyledDualToggle
    {...props}
    options={batchTypeOptions}
  />
)
