
import PropTypes from 'prop-types'
import {
  Form,
  FormItem,
  PatternValidator,
  RequiredValidator,
  FormFieldType,
  MaxLengthValidator,
} from '@/components/Form/ReactHookForm'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { Localization, localize } from '@/localization/i18n'
import { FORM_FIELD_CODES } from '../constants'
import { FileUpload } from '../FileUpload'

const DocumentTypeImportForm = ({
  disabled,
  handleSubmit,
  onSubmit,
  setData,
}) => {
  const fields = [
    {
      code: FORM_FIELD_CODES.DOCUMENT_TYPE_NAME,
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
      code: FORM_FIELD_CODES.FILE,
      render: (props) => (
        <FileUpload
          {...props}
          disabled={disabled}
          setData={setData}
        />
      ),
    },
  ]

  return (
    <Form
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    >
      {
        fields.map(({ label, requiredMark, ...field }) => (
          <FormItem
            key={field.code}
            field={field}
            label={label}
            requiredMark={requiredMark}
          />
        ))
      }
    </Form>
  )
}

DocumentTypeImportForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export {
  DocumentTypeImportForm,
}
