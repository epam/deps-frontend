
import PropTypes from 'prop-types'
import {
  ValueContainer,
  ValueField,
  ValueText,
  FieldAlias,
} from './StringInsight.styles'

export const StringInsight = ({ value, alias }) => (
  <ValueContainer>
    {
      alias && (
        <FieldAlias text={alias} />
      )
    }
    <ValueField>
      <ValueText text={value} />
    </ValueField>
  </ValueContainer>
)

StringInsight.propTypes = {
  value: PropTypes.string,
  alias: PropTypes.string,
}
