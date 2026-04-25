
import {
  FormItem,
  PatternValidator,
  RequiredValidator,
  FormFieldType,
  MaxLengthValidator,
} from '@/components/Form/ReactHookForm'
import { CustomSelect, SelectOption } from '@/components/Select'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { ExtractionLLMSelect } from '@/containers/ExtractionLLMSelect'
import { PageSpanSection } from '@/containers/PageSpanSection'
import { Localization, localize } from '@/localization/i18n'
import { InstructionSection } from '../InstructionSection'
import { KnownContextAttachments } from '../KnownContextAttachments'
import { TemperatureSection } from '../TemperatureSection'
import {
  FieldsList,
  FieldsWrapper,
  Form,
  InputNumber,
  Wrapper,
} from './LLMExtractorForm.styles'

const FIELDS_CODE = {
  NAME: 'extractorName',
  LLM_MODEL: 'llmModel',
  GROUPING_FACTOR: 'groupingFactor',
  PAGE_SPAN: 'pageSpan',
  CONTEXT_ATTACHMENTS: 'contextAttachments',
}

const MIN_GROUPING_FACTOR_VALUE = 1
const DEFAULT_GROUPING_FACTOR_VALUE = 5

const CONTEXT_ATTACHMENTS_OPTIONS = [
  new SelectOption(
    KnownContextAttachments.DOCUMENT_IMAGES,
    localize(Localization.AI_CONTEXT_TEXT_AND_IMAGES),
    { title: localize(Localization.AI_CONTEXT_TEXT_AND_IMAGES_TOOLTIP) },
  ),
  new SelectOption(
    '',
    localize(Localization.AI_CONTEXT_TEXT_ONLY),
    { title: localize(Localization.AI_CONTEXT_TEXT_ONLY_TOOLTIP) },
  ),
]

const LLMExtractorForm = () => {
  const baseFields = [
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
      },
    },
    {
      code: FIELDS_CODE.LLM_MODEL,
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
  ]

  const groupingFactorFields = [{
    code: FIELDS_CODE.GROUPING_FACTOR,
    label: localize(Localization.GROUPING_FACTOR),
    defaultValue: DEFAULT_GROUPING_FACTOR_VALUE,
    requiredMark: true,
    rules: {
      ...new RequiredValidator(),
    },
    render: (props) => (
      <InputNumber
        {...props}
        min={MIN_GROUPING_FACTOR_VALUE}
        placeholder={localize(Localization.GROUPING_FACTOR_PLACEHOLDER)}
      />
    ),
  }]

  const pageSpanFields = [{
    code: FIELDS_CODE.PAGE_SPAN,
    label: localize(Localization.PAGE_SPAN),
    render: PageSpanSection,
  }]

  const contextAttachmentsFields = [{
    code: FIELDS_CODE.CONTEXT_ATTACHMENTS,
    label: localize(Localization.CONTEXT_FOR_EXTRACTION),
    defaultValue: '',
    render: (props) => (
      <CustomSelect
        {...props}
        options={CONTEXT_ATTACHMENTS_OPTIONS}
      />
    ),
  }]

  const renderFields = (fields) => fields.map(({ label, requiredMark, ...field }) => (
    <FormItem
      key={field.code}
      field={field}
      label={label}
      requiredMark={requiredMark}
    />
  ))

  return (
    <Form>
      <Wrapper>
        <FieldsList>
          <FieldsWrapper>
            {renderFields(baseFields)}
          </FieldsWrapper>
          <TemperatureSection />
          <FieldsWrapper>
            {renderFields([...groupingFactorFields, ...contextAttachmentsFields])}
          </FieldsWrapper>
          {renderFields(pageSpanFields)}
        </FieldsList>
        <InstructionSection />
      </Wrapper>
    </Form>
  )
}

export {
  LLMExtractorForm,
}
