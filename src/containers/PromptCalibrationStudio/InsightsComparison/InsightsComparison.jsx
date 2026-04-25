
import PropTypes from 'prop-types'
import { FieldType } from '@/enums/FieldType'
import {
  fieldShape,
  keyValuePairValueShape,
  listItemShape,
  MULTIPLICITY,
} from '../viewModels'
import {
  CheckmarkInsightsComparison,
  KeyValuePairInsightsComparison,
  ListInsightsComparison,
  StringInsightsComparison,
} from './ComparisonFields'
import { ComparisonLayout } from './ComparisonLayout'

const FIELD_COMPONENT_MAP = {
  [FieldType.STRING]: {
    [MULTIPLICITY.SINGLE]: StringInsightsComparison,
    [MULTIPLICITY.MULTIPLE]: ListInsightsComparison,
  },
  [FieldType.DICTIONARY]: {
    [MULTIPLICITY.SINGLE]: KeyValuePairInsightsComparison,
    [MULTIPLICITY.MULTIPLE]: ListInsightsComparison,
  },
  [FieldType.CHECKMARK]: {
    [MULTIPLICITY.SINGLE]: CheckmarkInsightsComparison,
    [MULTIPLICITY.MULTIPLE]: ListInsightsComparison,
  },
}

export const InsightsComparison = ({ field, executedValue }) => {
  const FieldComponent = FIELD_COMPONENT_MAP[field.fieldType][field.multiplicity]
  const hasExecutedValue = executedValue != null && executedValue !== ''

  const renderOldValue = ({ borderColor }) => (
    <FieldComponent
      borderColor={borderColor}
      fieldType={field.fieldType}
      value={field.value}
    />
  )

  const renderNewValue = ({ borderColor }) => (
    <FieldComponent
      borderColor={borderColor}
      fieldType={field.fieldType}
      value={executedValue}
    />
  )

  return (
    <ComparisonLayout
      hasExecutedValue={hasExecutedValue}
      renderNewValue={renderNewValue}
      renderOldValue={renderOldValue}
    />
  )
}

InsightsComparison.propTypes = {
  field: fieldShape.isRequired,
  executedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    keyValuePairValueShape,
    PropTypes.arrayOf(
      listItemShape,
    ),
  ]),
}
