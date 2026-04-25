
import PropTypes from 'prop-types'
import { Checkbox } from '@/components/Checkbox'
import { DatePicker } from '@/components/DatePicker'
import { DateTimePicker } from '@/components/DateTimePicker'
import { Input } from '@/components/Input'
import { InputNumber } from '@/components/InputNumber'
import { CustomSelect } from '@/components/Select'
import { TextAreaField } from '@/components/TextAreaField'
import { TimePicker } from '@/components/TimePicker'
import { FormFieldType } from './FormFieldType'

const FormField = ({
  render,
  type,
  ...restProps
}) => {
  if (render) {
    return render(restProps)
  }

  const getField = () => {
    switch (type) {
      case FormFieldType.ENUM:
        return <CustomSelect {...restProps} />
      case FormFieldType.CHECKMARK:
        return <Checkbox {...restProps} />
      case FormFieldType.DATE:
        return <DatePicker {...restProps} />
      case FormFieldType.DATE_TIME:
        return <DateTimePicker {...restProps} />
      case FormFieldType.TIME:
        return <TimePicker {...restProps} />
      case FormFieldType.NUMBER:
        return <InputNumber {...restProps} />
      case FormFieldType.STRING:
        return <Input {...restProps} />
      case FormFieldType.TEXTAREA:
        return <TextAreaField {...restProps} />
      default:
        throw new Error(`${type} is not supported field type.`)
    }
  }

  return getField()
}

FormField.propTypes = {
  render: PropTypes.func,
  type: PropTypes.oneOf(Object.values(FormFieldType)),
}

export {
  FormField,
}
