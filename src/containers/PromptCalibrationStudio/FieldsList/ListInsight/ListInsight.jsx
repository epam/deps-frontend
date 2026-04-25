
import PropTypes from 'prop-types'
import { CheckmarkInsight } from '@/containers/PromptCalibrationStudio/FieldsList/CheckmarkInsight'
import { KeyValuePairInsight } from '@/containers/PromptCalibrationStudio/FieldsList/KeyValuePairInsight'
import { StringInsight } from '@/containers/PromptCalibrationStudio/FieldsList/StringInsight'
import { listItemShape, SUPPORTED_BASE_FIELD_TYPES } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import {
  ListContainer,
  ListItemWrapper,
} from './ListInsight.styles'

const INSIGHT_COMPONENT_MAP = {
  [FieldType.STRING]: StringInsight,
  [FieldType.DICTIONARY]: KeyValuePairInsight,
  [FieldType.CHECKMARK]: CheckmarkInsight,
}

export const ListInsight = ({ value, fieldType }) => {
  const InsightComponent = INSIGHT_COMPONENT_MAP[fieldType]

  return (
    <ListContainer>
      {
        value.map((v, i) => (
          <ListItemWrapper key={i}>
            <InsightComponent
              alias={v.alias}
              value={v.content}
            />
          </ListItemWrapper>
        ))
      }
    </ListContainer>
  )
}

ListInsight.propTypes = {
  value: PropTypes.arrayOf(
    listItemShape,
  ).isRequired,
  fieldType: PropTypes.oneOf(
    SUPPORTED_BASE_FIELD_TYPES,
  ).isRequired,
}
