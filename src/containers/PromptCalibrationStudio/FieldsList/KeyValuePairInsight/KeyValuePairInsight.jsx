
import PropTypes from 'prop-types'
import { keyValuePairValueShape } from '@/containers/PromptCalibrationStudio/viewModels'
import {
  KeyValueContainer,
  KeyValueColumn,
  KeyValueText,
  FieldAlias,
  Wrapper,
} from './KeyValuePairInsight.styles'

export const KeyValuePairInsight = ({ value, alias }) => (
  <Wrapper>
    {
      alias && (
        <FieldAlias text={alias} />
      )
    }
    <KeyValueContainer>
      <KeyValueColumn>
        <KeyValueText text={value?.key} />
      </KeyValueColumn>
      <KeyValueColumn>
        <KeyValueText text={value?.value} />
      </KeyValueColumn>
    </KeyValueContainer>
  </Wrapper>
)

KeyValuePairInsight.propTypes = {
  value: keyValuePairValueShape,
  alias: PropTypes.string,
}
