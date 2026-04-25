
import { useCallback, useMemo } from 'react'
import {
  FormItem,
  PatternValidator,
  RequiredValidator,
  FormFieldType,
  MaxLengthValidator,
} from '@/components/Form/ReactHookForm'
import { GraduatedSlider } from '@/components/GraduatedSlider'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { ExtractionLLMSelect } from '@/containers/ExtractionLLMSelect'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { extractorShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import {
  FIELDS_CODE,
  TemperatureFieldSettings,
  TopPFieldSettings,
  MIN_GROUPING_FACTOR_VALUE,
} from '../constants'
import {
  Form,
  InputNumber,
  TextArea,
  StyledPageSpanSection,
} from './ManageLLMExtractorForm.styles'

const validateUniqueName = (name, id, extractors) => {
  const isDuplicate = extractors.some((e) =>
    e.name.toLowerCase() === name.trim().toLowerCase() && e.id !== id,
  )

  return isDuplicate ? localize(Localization.EXTRACTOR_NAME_ALREADY_EXISTS) : true
}

export const ManageLLMExtractorForm = ({ extractor }) => {
  const { extractors } = useFieldCalibration()

  const fields = useMemo(() => [
    {
      code: FIELDS_CODE.NAME,
      label: localize(Localization.NAME),
      requiredMark: true,
      type: FormFieldType.STRING,
      placeholder: localize(Localization.NAME_PLACEHOLDER),
      rules: {
        ...new RequiredValidator(),
        ...new PatternValidator(
          FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
          localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
        ),
        ...new MaxLengthValidator(),
        validate: (value) => validateUniqueName(value, extractor?.id, extractors),
      },
    },
    {
      code: FIELDS_CODE.MODEL,
      label: localize(Localization.LLM_MODEL),
      requiredMark: true,
      rules: {
        ...new RequiredValidator(),
      },
      render: (props) => (
        <ExtractionLLMSelect
          {...props}
          allowClear
          allowSearch
          placeholder={localize(Localization.SELECT_LLM_MODEL)}
        />
      ),
    },
    {
      code: FIELDS_CODE.TEMPERATURE,
      label: localize(Localization.TEMPERATURE),
      render: (props) => (
        <GraduatedSlider
          {...props}
          {...TemperatureFieldSettings}
        />
      ),
    },
    {
      code: FIELDS_CODE.TOP_P,
      label: localize(Localization.TOP_P),
      render: (props) => (
        <GraduatedSlider
          {...props}
          {...TopPFieldSettings}
        />
      ),
    },
    {
      code: FIELDS_CODE.GROUPING_FACTOR,
      label: localize(Localization.GROUPING_FACTOR),
      render: (props) => (
        <InputNumber
          {...props}
          min={MIN_GROUPING_FACTOR_VALUE}
          placeholder={localize(Localization.GROUPING_FACTOR_PLACEHOLDER)}
        />
      ),
    },
    {
      code: FIELDS_CODE.PAGE_SPAN,
      label: localize(Localization.PAGE_SPAN),
      render: (props) => (
        <StyledPageSpanSection
          {...props}
        />
      ),
    },
    {
      code: FIELDS_CODE.CUSTOM_INSTRUCTION,
      label: localize(Localization.CUSTOM_INSTRUCTION),
      render: (props) => (
        <TextArea
          {...props}
          autoSize
        />
      ),
    },
  ], [extractor?.id, extractors])

  const renderFields = useCallback((fields) => (
    fields.map(({ label, requiredMark, ...field }) => (
      <FormItem
        key={field.code}
        field={field}
        label={label}
        requiredMark={requiredMark}
      />
    ))
  ), [])

  return (
    <Form>
      {renderFields(fields)}
    </Form>
  )
}

ManageLLMExtractorForm.propTypes = {
  extractor: extractorShape,
}
