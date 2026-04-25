
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useController } from 'react-hook-form'
import { FormField } from './FormField'
import { FormFieldType } from './FormFieldType'
import {
  Wrapper,
  FieldLabel,
  ErrorMessage,
  HintMessage,
} from './FormItem.styles'
import { maxLengthValidatorShape, patternValidatorShape, requiredValidatorShape } from './Validators'

const FormItem = ({
  label,
  requiredMark,
  field,
  children,
  className,
}) => {
  const { defaultValue, rules, code, handler, hint, ...rest } = field || {}
  const { field: { onChange, onBlur, value, ref }, fieldState } = useController({
    name: code,
    rules,
    ...(defaultValue !== undefined && { defaultValue }),
  })

  const onFieldChange = (e) => {
    onChange(e)
    handler?.onChange?.(e)
  }

  const Error = useMemo(() => (
    <ErrorMessage data-error={!!fieldState.error}>
      {fieldState.error?.message}
    </ErrorMessage>
  ), [fieldState.error])

  const Hint = useMemo(() => (
    <HintMessage>
      {hint}
    </HintMessage>
  ), [hint])

  return (
    <Wrapper
      $hasError={!!fieldState.error}
      $isCheckmarkField={field.type === FormFieldType.CHECKMARK}
      className={className}
    >
      <FieldLabel
        $isCheckmarkField={field.type === FormFieldType.CHECKMARK}
        name={label}
        required={requiredMark}
      />
      {
        children || (
          <FormField
            defaultValue={defaultValue}
            innerRef={ref}
            onBlur={onBlur}
            onChange={onFieldChange}
            value={value}
            {...rest}
          />
        )
      }
      { hint && Hint }
      { Error }
    </Wrapper>
  )
}

FormItem.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  children: PropTypes.element,
  className: PropTypes.string,
  requiredMark: PropTypes.bool,
  field: PropTypes.shape({
    code: PropTypes.string.isRequired,
    placeHolder: PropTypes.string,
    render: PropTypes.func,
    type: PropTypes.oneOf(Object.values(FormFieldType)),
    requiredMark: PropTypes.bool,
    handler: PropTypes.shape({
      onChange: PropTypes.func,
    }),
    rules: PropTypes.shape({
      required: requiredValidatorShape,
      maxLength: maxLengthValidatorShape,
      pattern: patternValidatorShape,
      validate: PropTypes.func,
    }),
    // eslint-disable-next-line react/forbid-prop-types
    defaultValue: PropTypes.any,
  }),
}

export {
  FormItem,
}
