
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { CustomForm } from '@/components/Form'
import { ModalButton } from '../ModalButton'
import { ModalFormButton } from './ModalFormButton'

jest.mock('@/utils/env', () => mockEnv)

const fields = {
  code: {
    render: jest.fn(),
  },
  title: {
    render: jest.fn(),
  },
}

const NEW_VALUES = 'NEW_VALUES'

describe('Component: ModalFormButton', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      title: 'modal_title',
      fields: fields,
      openButtonProps: {
        text: 'open_button_text',
        disabled: false,
      },
      okButtonProps: {
        text: 'save_button_text',
        disabled: false,
      },
      areValuesChanged: jest.fn(() => true),
      onOk: jest.fn(),
      fetching: false,
    }

    wrapper = shallow(<ModalFormButton {...defaultProps} />)
  })

  const getModalOkButtonProps = () => wrapper.find(ModalButton).props().okButtonProps

  it('should render ModalButton and Form with default props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should pass correct callback to the ModalButton onOk prop', () => {
    expect(wrapper.find(ModalButton).props().onOk).toEqual(wrapper.instance().onOk)
  })

  it('should enable okButon if areValuesChanged returned true and there is no validation errros', () => {
    wrapper.instance().onFieldsChange(NEW_VALUES)

    expect(getModalOkButtonProps().disabled).toEqual(false)
  })

  it('should enable okButon if there is no errors and areValuesChanged was not provided', () => {
    delete defaultProps.areValuesChanged
    wrapper.setProps(defaultProps)

    wrapper.instance().onFieldsChange(NEW_VALUES)

    expect(getModalOkButtonProps().disabled).toEqual(false)
  })

  it('should disable okButton if there were validation errors', () => {
    const errors = ['ERROR']
    wrapper.instance().onFieldsChange(NEW_VALUES, errors)

    expect(getModalOkButtonProps().disabled).toEqual(true)
  })

  it('should disable okButton if there were no validation errors but values has not changed', () => {
    defaultProps.areValuesChanged = jest.fn(() => false)
    wrapper.setProps(defaultProps)

    wrapper.instance().onFieldsChange(NEW_VALUES)

    expect(getModalOkButtonProps().disabled).toEqual(true)
  })

  it('should pass correct onFieldsChange callback to the form', () => {
    expect(wrapper.find(CustomForm).props().onValuesChange).toEqual(wrapper.instance().onValuesChange)
  })

  it('should call onOk callback when calling to onOk method with updated values', () => {
    const errors = []
    const newValues = NEW_VALUES
    wrapper.instance().onFieldsChange(newValues, errors)
    wrapper.instance().onOk()

    expect(defaultProps.onOk).toHaveBeenCalledTimes(1)
    expect(defaultProps.onOk).toBeCalledWith(newValues)
  })
})
