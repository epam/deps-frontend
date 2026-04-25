
import PropTypes from 'prop-types'
import {
  Form,
  FormItem,
  RequiredValidator,
  FormFieldType,
  PatternValidator,
  MaxLengthValidator,
} from '@/components/Form/ReactHookForm'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { localize, Localization } from '@/localization/i18n'

const FIELD_PROPERTY = {
  NAME: 'name',
}

const CreateAiPromptedExtractorForm = ({
  createAiPromptedExtractor,
  handleSubmit,
}) => {
  const fields = [
    {
      code: FIELD_PROPERTY.NAME,
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
  ]

  return (
    <Form
      handleSubmit={handleSubmit}
      onSubmit={createAiPromptedExtractor}
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

CreateAiPromptedExtractorForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  createAiPromptedExtractor: PropTypes.func.isRequired,
}

export { CreateAiPromptedExtractorForm }
