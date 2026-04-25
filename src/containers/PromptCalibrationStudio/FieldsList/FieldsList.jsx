
import PropTypes from 'prop-types'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { extractorShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { CALIBRATION_MODE } from '../constants'
import { FieldAdvancedCalibration } from '../FieldAdvancedCalibration'
import { Field } from './Field'
import { Wrapper } from './FieldsList.styles'

const getExtractorById = (extractors, extractorId) => (
  extractors.find((extractor) => extractor.id === extractorId) || extractors[0]
)

export const FieldsList = ({ extractors }) => {
  const {
    activeField,
    calibrationMode,
    fields,
  } = useFieldCalibration()

  if (
    calibrationMode === CALIBRATION_MODE.ADVANCED ||
    activeField?.query.nodes.length > 1
  ) {
    return (
      <FieldAdvancedCalibration extractors={extractors} />
    )
  }

  return (
    <Wrapper>
      {
        fields.map((field) => {
          const extractor = getExtractorById(extractors, field.extractorId)

          return (
            <Field
              key={field.id}
              extractor={extractor}
              field={field}
            />
          )
        })
      }
    </Wrapper>
  )
}

FieldsList.propTypes = {
  extractors: PropTypes.arrayOf(extractorShape).isRequired,
}
