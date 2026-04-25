
import { RadioOption } from '@/components/Radio/RadioOption'
import { MULTIPLICITY } from '@/containers/PromptCalibrationStudio/viewModels'
import { localize, Localization } from '@/localization/i18n'
import { StyledDualToggle } from './MultiplicitySwitcher.styles'

const multiplicityOptions = [
  new RadioOption({
    value: MULTIPLICITY.SINGLE,
    text: localize(Localization.SINGLE),
  }),
  new RadioOption({
    value: MULTIPLICITY.MULTIPLE,
    text: localize(Localization.MULTIPLE),
  }),
]

export const MultiplicitySwitcher = (props) => (
  <StyledDualToggle
    {...props}
    options={multiplicityOptions}
  />
)
