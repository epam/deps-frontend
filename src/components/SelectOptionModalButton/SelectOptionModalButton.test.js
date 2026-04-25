
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ModalFormButton } from '@/components/ModalFormButton'
import { SelectOption } from '@/components/Select'
import { SelectOptionModalButton } from './SelectOptionModalButton'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: SelectOptionModalButton', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      title: 'Test title',
      placeholder: 'Test placeholder',
      emptySearchText: 'Test text',
      onSave: jest.fn(),
      children: 'Test children',
      options: [
        new SelectOption('mockOptionValue', 'mockOptionText'),
      ],
      saveButtonText: 'mockSaveButtonText',
      disabled: false,
      fetching: false,
    }

    wrapper = shallow(
      <SelectOptionModalButton {...defaultProps}>
        Change Document Type
      </SelectOptionModalButton>,
    )
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call the props.onSave when calling onOk method', async () => {
    const formValues = { option: 'testOption' }
    await wrapper.instance().onOk(formValues)
    expect(defaultProps.onSave).toHaveBeenCalledWith(formValues.option)
  })

  it('should render ModalFormButton with proper onOk prop', () => {
    expect(wrapper.find(ModalFormButton).props().onOk).toEqual(wrapper.instance().onOk)
  })

  it('should render ModalFormButton with proper fields prop (with Autocomplete)', () => {
    const autocomplete = wrapper.find(ModalFormButton).props().fields.option.render()
    expect(shallow(<div>{autocomplete}</div>)).toMatchSnapshot()
  })
})
