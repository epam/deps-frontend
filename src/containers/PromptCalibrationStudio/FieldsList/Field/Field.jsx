
import { FieldLabel } from '@/components/FieldLabel'
import { NewspaperIcon } from '@/components/Icons/NewspaperIcon'
import { CALIBRATION_MODE } from '@/containers/PromptCalibrationStudio/constants'
import { FieldBaseCalibration } from '@/containers/PromptCalibrationStudio/FieldBaseCalibration'
import { CheckmarkInsight } from '@/containers/PromptCalibrationStudio/FieldsList/CheckmarkInsight'
import { KeyValuePairInsight } from '@/containers/PromptCalibrationStudio/FieldsList/KeyValuePairInsight'
import { ListInsight } from '@/containers/PromptCalibrationStudio/FieldsList/ListInsight'
import { StringInsight } from '@/containers/PromptCalibrationStudio/FieldsList/StringInsight'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { confirmHandler } from '@/containers/PromptCalibrationStudio/utils'
import {
  extractorShape,
  fieldShape,
  MULTIPLICITY,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { localize, Localization } from '@/localization/i18n'
import { NodesPreview } from '../NodesPreview'
import {
  CardContainer,
  CardHeader,
  CalibrateButton,
  CalibrateIconWrapper,
  CalibrateText,
} from './Field.styles'

const INSIGHT_RENDERER_MAP = {
  [FieldType.STRING]: {
    [MULTIPLICITY.SINGLE]: StringInsight,
    [MULTIPLICITY.MULTIPLE]: ListInsight,
  },
  [FieldType.DICTIONARY]: {
    [MULTIPLICITY.SINGLE]: KeyValuePairInsight,
    [MULTIPLICITY.MULTIPLE]: ListInsight,
  },
  [FieldType.CHECKMARK]: {
    [MULTIPLICITY.SINGLE]: CheckmarkInsight,
    [MULTIPLICITY.MULTIPLE]: ListInsight,
  },
}

export const Field = ({
  field,
  extractor,
}) => {
  const {
    calibrationMode,
    setCalibrationMode,
    setActiveField,
    activeField,
  } = useFieldCalibration()

  const InsightRenderer = INSIGHT_RENDERER_MAP[field.fieldType][field.multiplicity]

  const switchCalibrationMode = () => {
    const mode = (
      field.query.nodes?.length > 1
        ? CALIBRATION_MODE.ADVANCED
        : CALIBRATION_MODE.BASE
    )

    setCalibrationMode(mode)
    setActiveField(field)
  }

  const onClickHandler = () => {
    confirmHandler(
      switchCalibrationMode,
      activeField?.isDirty,
      localize(Localization.DISCARD_CHANGES_BEFORE_SWITCH_MODE),
    )
  }

  if (
    calibrationMode === CALIBRATION_MODE.BASE &&
    activeField.id === field.id
  ) {
    return (
      <FieldBaseCalibration
        field={field}
        llmExtractor={extractor}
      />
    )
  }

  return (
    <CardContainer>
      <CardHeader>
        <FieldLabel
          name={field.name}
          required={field.required}
        />
        <NodesPreview nodes={field.query.nodes} />
        <CalibrateButton onClick={onClickHandler}>
          <CalibrateIconWrapper>
            <NewspaperIcon />
          </CalibrateIconWrapper>
          <CalibrateText>
            {localize(Localization.CALIBRATE_PROMPT)}
          </CalibrateText>
        </CalibrateButton>
      </CardHeader>
      <InsightRenderer
        fieldType={field.fieldType}
        value={field.value}
      />
    </CardContainer>
  )
}

Field.propTypes = {
  field: fieldShape.isRequired,
  extractor: extractorShape.isRequired,
}
