
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOCREngines } from '@/actions/engines'
import {
  FormFieldType,
  PatternValidator,
  RequiredValidator,
} from '@/components/Form'
import { CustomSelect } from '@/components/Select'
import { Switch } from '@/components/Switch'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { DocumentTypesGroupsSelect } from '@/containers/DocumentTypesGroupsSelect'
import { ExtractionLLMSelect } from '@/containers/ExtractionLLMSelect'
import { ParsingFeaturesSwitch } from '@/containers/ParsingFeaturesSwitch'
import { FIELD_FORM_CODE } from '@/containers/UploadSplittingFilesDrawer/constants'
import { ComponentSize } from '@/enums/ComponentSize'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { Engine } from '@/models/Engine'
import { ocrEnginesSelector } from '@/selectors/engines'
import { areEnginesFetchingSelector } from '@/selectors/requests'
import { ENV } from '@/utils/env'
import { BatchTypeSwitcher } from '../BatchTypeSwitcher'
import { Hints } from '../Hints'
import { StyledForm, StyledFormItem } from './BatchSettingsForm.styles'

export const BatchSettingsForm = () => {
  const engines = useSelector(ocrEnginesSelector)
  const areEnginesFetching = useSelector(areEnginesFetchingSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    !engines.length && dispatch(fetchOCREngines())
  }, [dispatch, engines?.length])

  const fields = [
    {
      code: FIELD_FORM_CODE.AUTOMATIC_SPLITTING,
      label: localize(Localization.AUTOMATIC_SPLITTING),
      type: FieldType.CHECKMARK,
      render: ({ value, defaultValue, ...restProps }) => (
        <Switch
          checked={value}
          defaultChecked={defaultValue}
          disabled
          size={ComponentSize.SMALL}
          {...restProps}
        />
      ),
    },
    ...(ENV.FEATURE_DOCUMENT_TYPES_GROUPS
      ? [{
        code: FIELD_FORM_CODE.GROUP,
        label: localize(Localization.GROUP),
        render: DocumentTypesGroupsSelect,
      }]
      : []
    ),
    {
      code: FIELD_FORM_CODE.BATCH_TYPE,
      label: localize(Localization.BATCH_TYPE),
      disabled: true,
      render: BatchTypeSwitcher,
    },
    {
      code: FIELD_FORM_CODE.BATCH_NAME,
      label: localize(Localization.BATCH_NAME),
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
    ...(ENV.FEATURE_LLM_DATA_EXTRACTION
      ? [{
        code: FIELD_FORM_CODE.LLM_TYPE,
        label: localize(Localization.LLM_TYPE),
        placeholder: localize(Localization.SELECT_LLM_TYPE),
        render: ExtractionLLMSelect,
      }]
      : []
    ),
    {
      code: FIELD_FORM_CODE.ENGINE,
      label: localize(Localization.ENGINE),
      placeholder: localize(Localization.SELECT_ENGINE),
      render: (props) => (
        <CustomSelect
          {...props}
          allowClear={true}
          fetching={areEnginesFetching}
          options={Engine.toAllEnginesOptions(engines)}
        />
      ),
    },
    {
      code: FIELD_FORM_CODE.PARSING_FEATURES,
      label: localize(Localization.PARSING_FEATURES),
      placeholder: localize(Localization.SELECT_PARSING_FEATURE),
      render: ParsingFeaturesSwitch,
    },
  ]

  return (
    <StyledForm>
      {
        fields.map(({ label, requiredMark, ...field }) => (
          <StyledFormItem
            key={field.code}
            field={field}
            label={label}
            requiredMark={requiredMark}
          />
        ))
      }
      <Hints />
    </StyledForm>
  )
}
