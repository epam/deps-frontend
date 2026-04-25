
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { FormFieldType } from '@/components/Form'
import { Form } from '@/components/Form/ReactHookForm'
import { SelectOption } from '@/components/Select/SelectOption'
import { Switch } from '@/components/Switch'
import { ComponentSize } from '@/enums/ComponentSize'
import { REVIEW_POLICY_TO_LABEL } from '@/enums/ReviewPolicy'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { DEFAULT_FORM_VALUES, WORKFLOW_FORM_FIELD_CODES } from '../constants'
import { WorkflowFormItem } from './WorkflowConfigurationForm.styles'

const reviewPolicyOptions = Object.entries(REVIEW_POLICY_TO_LABEL).map(
  ([value, text]) => new SelectOption(value, text),
)

const renderFields = (fields) => (
  fields.map(({ label, requiredMark, ...field }) => (
    <WorkflowFormItem
      key={field.code}
      field={field}
      label={label}
      requiredMark={requiredMark}
    />
  ))
)

const WorkflowConfigurationForm = ({
  onSubmit,
  handleSubmit,
}) => {
  const documentType = useSelector(documentTypeStateSelector)
  const { setValue } = useFormContext()

  const {
    needsExtraction = DEFAULT_FORM_VALUES.needsExtraction,
    needsReview = DEFAULT_FORM_VALUES.needsReview,
    needsValidation = DEFAULT_FORM_VALUES.needsValidation,
  } = documentType.workflowConfiguration || {}

  const handleNeedsExtractionChange = useCallback((onChange) => (value) => {
    if (!value) {
      setValue(WORKFLOW_FORM_FIELD_CODES.NEEDS_VALIDATION, false)
    }
    onChange(value)
  }, [setValue])

  const handleNeedsValidationChange = useCallback((onChange) => (value) => {
    if (value) {
      setValue(WORKFLOW_FORM_FIELD_CODES.NEEDS_EXTRACTION, true)
    }
    onChange(value)
  }, [setValue])

  const fields = useMemo(() => [
    {
      code: WORKFLOW_FORM_FIELD_CODES.NEEDS_REVIEW,
      label: localize(Localization.WORKFLOW_REVIEW_POLICY),
      hint: localize(Localization.WORKFLOW_REVIEW_POLICY_HINT),
      type: FormFieldType.ENUM,
      defaultValue: needsReview,
      options: reviewPolicyOptions,
    },
    {
      code: WORKFLOW_FORM_FIELD_CODES.NEEDS_EXTRACTION,
      label: localize(Localization.WORKFLOW_NEEDS_EXTRACTION),
      hint: localize(Localization.WORKFLOW_NEEDS_EXTRACTION_HINT),
      type: FormFieldType.CHECKMARK,
      defaultValue: needsExtraction,
      render: ({ value, onChange, ...restProps }) => (
        <Switch
          checked={!!value}
          onChange={handleNeedsExtractionChange(onChange)}
          size={ComponentSize.SMALL}
          {...restProps}
        />
      ),
    },
    {
      code: WORKFLOW_FORM_FIELD_CODES.NEEDS_VALIDATION,
      label: localize(Localization.WORKFLOW_NEEDS_VALIDATION),
      hint: localize(Localization.WORKFLOW_NEEDS_VALIDATION_HINT),
      type: FormFieldType.CHECKMARK,
      defaultValue: needsValidation,
      render: ({ value, onChange, ...restProps }) => (
        <Switch
          checked={!!value}
          onChange={handleNeedsValidationChange(onChange)}
          size={ComponentSize.SMALL}
          {...restProps}
        />
      ),
    },
  ], [
    handleNeedsExtractionChange,
    handleNeedsValidationChange,
    needsExtraction,
    needsValidation,
    needsReview,
  ])

  return (
    <Form
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    >
      {renderFields(fields)}
    </Form>
  )
}

WorkflowConfigurationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

export {
  WorkflowConfigurationForm,
}
