
import { FieldType } from '@/enums/FieldType'

const mockReactHookForm = ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(() => ({
    handleSubmit: jest.fn(),
    getValues: jest.fn(),
    formState: {},
  })),
  useController: jest.fn(({ defaultValue }) => ({
    field: {
      onChange: jest.fn(),
      value: defaultValue,
    },
    fieldState: {},
  })),
  useFormContext: jest.fn(() => ({
    control: {},
    setValue: jest.fn(),
    getValues: jest.fn(),
    formState: {},
    reset: jest.fn(),
  })),
  useWatch: jest.fn(() => FieldType.STRING),
  useFieldArray: jest.fn(() => ({
    fields: [],
    append: jest.fn(),
    remove: jest.fn(),
  })),
})

export {
  mockReactHookForm,
}
