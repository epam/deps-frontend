
import PropTypes from 'prop-types'
import { useEffect, useCallback } from 'react'
import { Form } from '../Form'
import {
  maxValidatorShape,
  requiredValidatorShape,
  alphaNumericValidatorShape,
  whitespaceValidatorShape,
  uniqueSymbolValidatorShape,
} from '../Validators'
import { FormWrapper } from './CustomForm.styles'

const FORM_LAYOUT = 'vertical'

// TODO #6051
const CustomForm = ({ fields, onFieldsChange, validateOnMount, hideErrorsForUntouchedFields }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!validateOnMount) {
      return
    }

    const validateSilently = () => form.validateFields().catch(() => undefined)

    const runValidation = async () => {
      await validateSilently()
      const values = form.getFieldsValue()
      const errors = form.getFieldsError().reduce((acc, curr) => {
        if (curr.errors && curr.errors.length) {
          acc.push(...curr.errors)
        }
        return acc
      }, [])
      onFieldsChange?.(values, errors)
    }

    runValidation()
  }, [validateOnMount, form, onFieldsChange])

  const getValues = useCallback((allFields) => {
    return Object.keys(allFields).reduce((acc, curr) => {
      const fieldName = allFields[curr].name.join(' ')
      acc[fieldName] = allFields[curr].value
      return acc
    }, {})
  }, [])

  const getErrors = useCallback((fields) => {
    return Object.keys(fields).reduce((acc, fieldName) => {
      const curr = fields[fieldName]
      if (!curr.errors) {
        return acc
      }

      acc.push(...curr.errors)
      return acc
    }, [])
  }, [])

  const isValidationInProgress = useCallback((fields) => {
    for (const key of Object.keys(fields)) {
      if (fields[key].validating) {
        return true
      }
    }

    return false
  }, [])

  const onChange = useCallback(
    (changedFields, allFields) => {
      if (isValidationInProgress(changedFields)) {
        return
      }

      const values = getValues(allFields)
      const errors = getErrors(allFields)

      onFieldsChange && onFieldsChange(values, errors)
    },
    [getValues, getErrors, isValidationInProgress, onFieldsChange],
  )

  const isVisible = (field, values, errors) => {
    const { visible } = field

    if (typeof visible === 'undefined') {
      return true
    }

    if (typeof visible === 'function') {
      return visible(values, errors)
    }

    return visible
  }

  const shouldForceHideErrors = (fieldName) => {
    const isTouched = form.isFieldTouched(fieldName)
    return hideErrorsForUntouchedFields && !isTouched
  }

  const getInitialValues = useCallback((fields) => {
    return Object.keys(fields).reduce((acc, fieldName) => {
      if (fields[fieldName].initialValue) {
        acc[fieldName] = fields[fieldName].initialValue
      }
      return acc
    }, {})
  }, [])

  const renderFormItem = (fieldName, field) => {
    const errorMessage = form.getFieldError(fieldName)
    const shouldShowError = !!errorMessage.length && !shouldForceHideErrors(fieldName)

    const helpMessage = shouldShowError ? errorMessage : ''
    const validateStatus = shouldShowError ? 'error' : ''

    return (
      <Form.Item
        key={fieldName}
        help={helpMessage}
        label={field.label}
        name={fieldName}
        rules={field.validators}
        validateFirst={true}
        validateStatus={validateStatus}
      >
        {
          field.render()
        }
      </Form.Item>
    )
  }

  const hasValidators = useCallback((fields) => {
    for (const key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        const validators = fields[key].validators
        if (validators && validators.length) {
          return true
        }
      }
    }
    return false
  }, [])

  return (
    <FormWrapper withoutValidation={!hasValidators(fields)}>
      <Form
        form={form}
        initialValues={getInitialValues(fields)}
        layout={FORM_LAYOUT}
        onFieldsChange={onChange}
      >
        {
          Object.keys(fields).map((fieldName) => {
            const currentField = fields[fieldName]
            const values = form.getFieldsValue()
            const errors = form.getFieldsError()
            const isVisibleField = isVisible(currentField, values, errors)

            return isVisibleField && renderFormItem(fieldName, currentField)
          })
        }
      </Form>
    </FormWrapper>
  )
}

CustomForm.propTypes = {
  fields: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string,
      render: PropTypes.func.isRequired,
      initialValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
          ]),
        ),
      ]),
      validators: PropTypes.arrayOf(
        PropTypes.oneOfType([
          maxValidatorShape,
          requiredValidatorShape,
          alphaNumericValidatorShape,
          whitespaceValidatorShape,
          uniqueSymbolValidatorShape,
        ]),
      ),
      visible: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
      ]),

      errors: PropTypes.arrayOf(PropTypes.string),
      validating: PropTypes.bool,
    }),
  ).isRequired,
  validateOnMount: PropTypes.bool,
  hideErrorsForUntouchedFields: PropTypes.bool,
  onFieldsChange: PropTypes.func,
}

export {
  CustomForm,
}
