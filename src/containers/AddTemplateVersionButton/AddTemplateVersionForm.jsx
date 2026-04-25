
import { Form, FormItem } from '@/components/Form/ReactHookForm'
import { Input } from '@/components/Input'
import { Localization, localize } from '@/localization/i18n'

const DESCRIPTION_MAX_LENGTH = 100

const FIELD_PROPERTY = {
  DESCRIPTION: 'description',
}

const AddTemplateVersionForm = () => {
  const fields = [
    {
      code: FIELD_PROPERTY.DESCRIPTION,
      label: localize(Localization.DESCRIPTION),
      requiredMark: false,
      placeholder: localize(Localization.DESCRIPTION_PLACEHOLDER),
      render: (props) => (
        <Input.TextArea
          {...props}
          autoSize={{ minRows: 1 }}
          maxLength={DESCRIPTION_MAX_LENGTH}
        />
      ),
    },
  ]

  return (
    <Form>
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

export {
  AddTemplateVersionForm,
}
