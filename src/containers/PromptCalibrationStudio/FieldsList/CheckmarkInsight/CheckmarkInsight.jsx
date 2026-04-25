
import PropTypes from 'prop-types'
import { RadioGroup } from '@/components/Radio'
import { RadioGroupOptions } from '@/containers/PromptCalibrationStudio/constants'
import {
  ValueContainer,
  FieldAlias,
  RadioGroupWrapper,
} from './CheckmarkInsight.styles'

export const CheckmarkInsight = ({ value, alias }) => (
  <ValueContainer>
    {
      alias && (
        <FieldAlias text={alias} />
      )
    }
    <RadioGroupWrapper>
      <RadioGroup
        disabled={true}
        options={RadioGroupOptions}
        value={value}
      />
    </RadioGroupWrapper>
  </ValueContainer>
)

CheckmarkInsight.propTypes = {
  value: PropTypes.bool,
  alias: PropTypes.string,
}
