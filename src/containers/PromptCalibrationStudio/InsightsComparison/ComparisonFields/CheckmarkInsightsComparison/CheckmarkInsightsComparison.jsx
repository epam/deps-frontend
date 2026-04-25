
import PropTypes from 'prop-types'
import { RadioGroup } from '@/components/Radio'
import { RadioGroupOptions } from '@/containers/PromptCalibrationStudio/constants'
import {
  Wrapper,
  RadioGroupWrapper,
  ContentWrapper,
  FieldAlias,
} from './CheckmarkInsightsComparison.styles'

export const CheckmarkInsightsComparison = ({
  value,
  alias,
  borderColor,
}) => (
  <Wrapper>
    {
      alias && (
        <FieldAlias text={alias} />
      )
    }
    <ContentWrapper $borderColor={borderColor}>
      <RadioGroupWrapper>
        <RadioGroup
          disabled={true}
          options={RadioGroupOptions}
          value={value}
        />
      </RadioGroupWrapper>
    </ContentWrapper>
  </Wrapper>
)

CheckmarkInsightsComparison.propTypes = {
  value: PropTypes.bool,
  borderColor: PropTypes.string.isRequired,
  alias: PropTypes.string,
}
