
import {
  FormFieldType,
  PatternValidator,
  RequiredValidator,
} from '@/components/Form'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { FIELD_FORM_CODE, FORM_SECTION_BLOCK_CODE } from '@/containers/ManageBatch/constants'
import {
  BatchFilesUpload,
  BulkDocTypeSelect,
  BulkEngineSelect,
  BulkExtractionLLMSelect,
  BulkFilesTitle,
  BulkParsingFeaturesSelect,
  GroupSelect,
} from '@/containers/ManageBatch/ManageBatchFormFields'
import {
  Form,
  FormItem,
  Section,
  SectionTitle,
  RightColumn,
  LeftColumn,
  BatchUploadFormItem,
} from '@/containers/ManageBatch/ManageBatchLayout.styles'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'

export const AddBatchForm = () => {
  const configurationsSections = [
    {
      code: FORM_SECTION_BLOCK_CODE.NAME_AND_GROUP,
      title: <SectionTitle>{localize(Localization.BATCH)}</SectionTitle>,
      fields: [
        {
          code: FIELD_FORM_CODE.BATCH_NAME,
          label: localize(Localization.NAME),
          placeholder: localize(Localization.BATCH_NAME),
          requiredMark: true,
          type: FormFieldType.STRING,
          rules: {
            ...new RequiredValidator(),
            ...new PatternValidator(
              FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
              localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
            ),
          },
        },
        ENV.FEATURE_DOCUMENT_TYPES_GROUPS && {
          code: FIELD_FORM_CODE.GROUP,
          label: localize(Localization.GROUP),
          render: GroupSelect,
        },
      ],
    },
    {
      code: FORM_SECTION_BLOCK_CODE.BULK_FILES_SETTINGS,
      title: <BulkFilesTitle />,
      fields: [
        {
          code: FIELD_FORM_CODE.DOCUMENT_TYPE,
          label: localize(Localization.DOCUMENT_TYPE),
          render: BulkDocTypeSelect,
        },
        {
          code: FIELD_FORM_CODE.ENGINE,
          label: localize(Localization.ENGINE),
          placeholder: localize(Localization.SELECT_ENGINE),
          render: BulkEngineSelect,
        },
        ENV.FEATURE_LLM_DATA_EXTRACTION && {
          code: FIELD_FORM_CODE.LLM_TYPE,
          label: localize(Localization.LLM_TYPE),
          placeholder: localize(Localization.SELECT_LLM_TYPE),
          render: BulkExtractionLLMSelect,
        },
        {
          code: FIELD_FORM_CODE.PARSING_FEATURES,
          label: localize(Localization.PARSING_FEATURES),
          placeholder: localize(Localization.SELECT_PARSING_FEATURE),
          defaultValue: [KnownParsingFeature.TEXT],
          render: BulkParsingFeaturesSelect,
        },
      ],
    },
  ]

  const batchFilesUploadField = {
    code: FIELD_FORM_CODE.FILES,
    render: BatchFilesUpload,
  }

  return (
    <Form>
      <LeftColumn>
        {
          configurationsSections.map((s) => (
            <Section key={s.code}>
              {s.title}
              {
                s.fields.map((field) => field && (
                  <FormItem
                    key={field.code}
                    field={field}
                    label={field.label}
                    requiredMark={field.requiredMark}
                  />
                ))
              }
            </Section>
          ))
        }
      </LeftColumn>
      <RightColumn>
        <BatchUploadFormItem
          field={batchFilesUploadField}
        />
      </RightColumn>
    </Form>
  )
}
