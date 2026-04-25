
import PropTypes from 'prop-types'
import {
  listItemShape,
  SUPPORTED_BASE_FIELD_TYPES,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { CheckmarkInsightsComparison } from '../CheckmarkInsightsComparison'
import { KeyValuePairInsightsComparison } from '../KeyValuePairInsightsComparison'
import { StringInsightsComparison } from '../StringInsightsComparison'
import { ListContainer } from './ListInsightsComparison.styles'

const INSIGHT_COMPONENT_MAP = {
  [FieldType.STRING]: StringInsightsComparison,
  [FieldType.DICTIONARY]: KeyValuePairInsightsComparison,
  [FieldType.CHECKMARK]: CheckmarkInsightsComparison,
}

export const ListInsightsComparison = ({ value, fieldType, borderColor }) => {
  const InsightComponent = INSIGHT_COMPONENT_MAP[fieldType]

  return (
    <ListContainer>
      {
        value.map((item, index) => (
          <InsightComponent
            key={index}
            alias={item.alias}
            borderColor={borderColor}
            fieldType={fieldType}
            value={item.content}
          />
        ))
      }
    </ListContainer>
  )
}

ListInsightsComparison.propTypes = {
  value: PropTypes.arrayOf(
    listItemShape,
  ).isRequired,
  fieldType: PropTypes.oneOf(
    SUPPORTED_BASE_FIELD_TYPES,
  ).isRequired,
  borderColor: PropTypes.string.isRequired,
}
