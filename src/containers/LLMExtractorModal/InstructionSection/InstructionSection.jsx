
import { Localization, localize } from '@/localization/i18n'
import {
  FormItem,
  TextArea,
  Wrapper,
} from './InstructionSection.styles'

const FIELDS_CODE = {
  INSTRUCTION: 'customInstruction',
}

const InstructionSection = () => {
  const instructionFields = [
    {
      code: FIELDS_CODE.INSTRUCTION,
      defaultValue: localize(Localization.LLM_MODEL_CUSTOM_INSTRUCTION),
      render: (props) => (
        <TextArea
          {...props}
        />
      ),
    },
  ]

  return (
    <Wrapper>
      {
        instructionFields.map(({ label, requiredMark, ...field }) => (
          <FormItem
            key={field.code}
            field={field}
            label={label}
            requiredMark={requiredMark}
          />
        ))
      }
    </Wrapper>
  )
}

export {
  InstructionSection,
}
