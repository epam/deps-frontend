
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import {
  Form,
  FormFieldType,
  FormItem,
  RequiredValidator,
} from '@/components/Form/ReactHookForm'
import { Input } from '@/components/Input'
import { Tooltip } from '@/components/Tooltip'
import { Localization, localize } from '@/localization/i18n'
import { documentSupplementShape } from '@/models/DocumentSupplement'
import { SetPromptButton, NameFieldWrapper } from './AddDocumentSupplementForm.styles'

const FIELD_CODE = {
  NAME: 'name',
  VALUE: 'value',
}

const MAX_ROWS = 10

const AddDocumentSupplementForm = ({
  field,
  onFieldChange,
  genAiPrompt,
  createField,
  handleSubmit,
}) => {
  const setPrompt = () => {
    onFieldChange(FIELD_CODE.NAME, genAiPrompt)
  }

  const fields = [
    {
      code: FIELD_CODE.NAME,
      label: localize(Localization.NAME),
      requiredMark: true,
      placeholder: localize(Localization.NAME_PLACEHOLDER),
      defaultValue: field.name,
      rules: new RequiredValidator(),
      type: FormFieldType.STRING,
    },
    {
      code: FIELD_CODE.VALUE,
      label: localize(Localization.VALUE),
      defaultValue: field.value,
      placeholder: localize(Localization.VALUE_PLACEHOLDER),
      render: (props) => (
        <Input.TextArea
          {...props}
          autoSize={
            {
              maxRows: MAX_ROWS,
            }
          }
        />
      ),
    },
  ]

  return (
    <Form
      handleSubmit={handleSubmit}
      onSubmit={createField}
    >
      {
        fields.map(({ label, requiredMark, ...field }) => {
          if (field.code === FIELD_CODE.NAME && genAiPrompt) {
            return (
              <NameFieldWrapper key={field.code}>
                <SetPromptButton>
                  <Tooltip title={genAiPrompt}>
                    <Button.Link onClick={setPrompt}>
                      {localize(Localization.SET_PROMPT)}
                    </Button.Link>
                  </Tooltip>
                </SetPromptButton>
                <FormItem
                  field={field}
                  label={label}
                  requiredMark={requiredMark}
                />
              </NameFieldWrapper>
            )
          }

          return (
            <FormItem
              key={field.code}
              field={field}
              label={label}
              requiredMark={requiredMark}
            />
          )
        })
      }
    </Form>
  )
}

AddDocumentSupplementForm.propTypes = {
  field: documentSupplementShape.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  genAiPrompt: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  createField: PropTypes.func.isRequired,
}

export {
  AddDocumentSupplementForm,
}
