
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
import { documentTypesGroupShape } from '@/models/DocumentTypesGroup'

const GROUP_PROPERTY = {
  NAME: 'name',
}

const NAME_MAX_LENGTH = 100

const EditDocumentTypesGroupForm = ({
  group,
  handleSubmit,
  saveGroup,
}) => {
  const fields = [
    {
      code: GROUP_PROPERTY.NAME,
      defaultValue: group.name,
      label: localize(Localization.NAME),
      requiredMark: true,
      type: FormFieldType.STRING,
      placeholder: localize(Localization.GROUP_PLACEHOLDER),
      hint: localize(Localization.MAXIMUM_CHARS_LIMIT, { limit: NAME_MAX_LENGTH }),
      rules: {
        ...new RequiredValidator(),
        ...new PatternValidator(
          FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
          localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
        ),
        ...new MaxLengthValidator(NAME_MAX_LENGTH),
      },
    },
  ]

  return (
    <Form
      handleSubmit={handleSubmit}
      onSubmit={saveGroup}
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

EditDocumentTypesGroupForm.propTypes = {
  group: documentTypesGroupShape.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  saveGroup: PropTypes.func.isRequired,
}

export {
  EditDocumentTypesGroupForm,
}
