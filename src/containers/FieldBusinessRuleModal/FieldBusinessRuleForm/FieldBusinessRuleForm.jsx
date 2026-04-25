
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { FormFieldType, PatternValidator, RequiredValidator } from '@/components/Form'
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { DateFieldIcon } from '@/components/Icons/DateFieldIcon'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { KeyValuePairFieldIcon } from '@/components/Icons/KeyValuePairFieldIcon'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { TableFieldIcon } from '@/components/Icons/TableFieldIcon'
import { CustomSelect, SelectMode, SelectOption } from '@/components/Select'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { FieldType, RESOURCE_FIELD_TYPE, RESOURCE_FIELDS_TYPES } from '@/enums/FieldType'
import { ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeStateSelector } from '@/selectors/documentType'
import {
  FORM_FIELD_CODES,
  severityOptions,
  ALPHANUMERIC_WITH_UNDERSCORE_DASH_REGEX,
  listModeOptions,
} from '../constants'
import { IssueMessageField } from '../IssueMessageField'
import { RuleField } from '../RuleField'
import {
  Form,
  FormItem,
  FieldsColumnWrapper,
  RuleFormItem,
  Toggle,
  FieldOptionWrapper,
  FieldOptionType,
  FieldOptionIcon,
} from './FieldBusinessRuleForm.styles'

const FIELD_TYPE_TO_ICON = {
  [FieldType.CHECKMARK]: <CheckboxFieldIcon />,
  [FieldType.STRING]: <StringFieldIcon />,
  [FieldType.DICTIONARY]: <KeyValuePairFieldIcon />,
  [FieldType.TABLE]: <TableFieldIcon />,
  [FieldType.ENUM]: <EnumFieldIcon />,
  [FieldType.DATE]: <DateFieldIcon />,
}

const createFieldOption = (f) => {
  const renderWithIcon = () => {
    const isList = f.fieldType === FieldType.LIST

    const typeKey = isList ? f.fieldMeta.baseType : f.fieldType

    const typeLabel = isList
      ? localize(Localization.LIST_OF, { value: RESOURCE_FIELDS_TYPES[typeKey] })
      : RESOURCE_FIELD_TYPE[typeKey]

    return (
      <FieldOptionWrapper>
        <span>{f.name}</span>
        <FieldOptionType>
          {typeLabel}
          <FieldOptionIcon>
            {FIELD_TYPE_TO_ICON[typeKey]}
          </FieldOptionIcon>
        </FieldOptionType>
      </FieldOptionWrapper>
    )
  }

  const renderLabel = () => f.name

  return new SelectOption(
    f.code,
    f.name,
    undefined,
    undefined,
    renderWithIcon,
    renderLabel,
  )
}

const renderFields = (fields, Wrapper = FormItem) => (
  fields.map(({ label, requiredMark, ...field }) => (
    <Wrapper
      key={field.code}
      $area={field.code}
      field={field}
      label={label}
      requiredMark={requiredMark}
    />
  ))
)

const FieldBusinessRuleForm = ({
  onSubmit,
  handleSubmit,
}) => {
  const documentType = useSelector(documentTypeStateSelector)

  const validatedFields = useWatch({ name: FORM_FIELD_CODES.VALIDATED_FIELDS })

  const dependentFields = useWatch({ name: FORM_FIELD_CODES.DEPENDENT_FIELDS })

  const validatedFieldsOptions = useMemo(
    () => documentType.fields?.map(createFieldOption),
    [documentType.fields],
  )

  const dependentFieldsOptions = useMemo(
    () => documentType.fields
      ?.filter((f) => !(validatedFields ?? []).includes(f.code))
      .map(createFieldOption),
    [documentType.fields, validatedFields],
  )

  const mentionFields = useMemo(() => {
    const validatedCodes = validatedFields ?? []
    const dependentCodes = dependentFields ?? []
    const allCodes = [...validatedCodes, ...dependentCodes]
    return documentType.fields?.filter((f) => allCodes.includes(f.code)) ?? []
  }, [documentType.fields, validatedFields, dependentFields])

  const baseFields = useMemo(() => [
    {
      code: FORM_FIELD_CODES.NAME,
      label: localize(Localization.NAME),
      requiredMark: true,
      placeholder: localize(Localization.NAME_PLACEHOLDER),
      type: FormFieldType.STRING,
      rules: {
        ...new RequiredValidator(),
        ...new PatternValidator(
          FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
          localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
        ),
        ...new PatternValidator(
          ALPHANUMERIC_WITH_UNDERSCORE_DASH_REGEX,
          localize(Localization.NO_SPECIAL_CHARACTERS),
        ),
      },
    },
    {
      code: FORM_FIELD_CODES.SEVERITY,
      label: localize(Localization.TYPE),
      requiredMark: true,
      defaultValue: ValidationRuleSeverity.ERROR,
      render: (props) => (
        <Toggle
          {...props}
          options={severityOptions}
        />
      ),
    },
    {
      code: FORM_FIELD_CODES.LIST_MODE,
      label: localize(Localization.LIST_FIELDS_VALIDATION_MODE),
      render: (props) => (
        <CustomSelect
          {...props}
          allowClear
          options={listModeOptions}
          placeholder={localize(Localization.NOT_APPLIED_TEXT)}
        />
      ),
    },
    {
      code: FORM_FIELD_CODES.VALIDATED_FIELDS,
      label: localize(Localization.VALIDATED_FIELDS),
      requiredMark: true,
      render: (props) => (
        <CustomSelect
          {...props}
          allowClear
          allowSearch
          mode={SelectMode.MULTIPLE}
          options={validatedFieldsOptions}
          placeholder={localize(Localization.ENTER_VALIDATED_FIELDS)}
        />
      ),
      rules: {
        ...new RequiredValidator(),
      },
    },
    {
      code: FORM_FIELD_CODES.DEPENDENT_FIELDS,
      label: localize(Localization.DEPENDENT_FIELDS),
      render: (props) => (
        <CustomSelect
          {...props}
          allowClear
          allowSearch
          mode={SelectMode.MULTIPLE}
          options={dependentFieldsOptions}
          placeholder={localize(Localization.ENTER_DEPENDENT_FIELDS)}
        />
      ),
    },
    {
      code: FORM_FIELD_CODES.ISSUE_MESSAGE,
      label: localize(Localization.ISSUE_MESSAGE),
      requiredMark: true,
      hint: localize(Localization.FIELD_REFERENCE_HINT),
      render: (props) => (
        <IssueMessageField
          {...props}
          mentionFields={mentionFields}
        />
      ),
      rules: {
        ...new RequiredValidator(),
      },
    },
  ], [
    validatedFieldsOptions,
    dependentFieldsOptions,
    mentionFields,
  ])

  const ruleField = useMemo(() => [
    {
      code: FORM_FIELD_CODES.RULE,
      hint: localize(Localization.FIELD_REFERENCE_HINT),
      render: (props) => (
        <RuleField
          {...props}
          mentionFields={mentionFields}
        />
      ),
      rules: {
        ...new RequiredValidator(),
      },
    },
  ], [mentionFields])

  return (
    <Form
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    >
      <FieldsColumnWrapper>
        {renderFields(baseFields)}
      </FieldsColumnWrapper>
      {renderFields(ruleField, RuleFormItem)}
    </Form>
  )
}

FieldBusinessRuleForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

export {
  FieldBusinessRuleForm,
}
