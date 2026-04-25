
import { mockConsole } from '@/mocks/mockConsole'
import { shallow, mount } from 'enzyme'
import flushPromises from 'flush-promises'
import { Input } from '@/components/Input'
import { RequiredValidator } from '../Validators'
import { CustomForm } from './CustomForm'

const getChangeEvent = (value) => ({
  target: {
    value: value,
  },
})

const withMutedConsole = async (asyncExpect) => {
  const restoreConsole = mockConsole()

  // await is used to queue an async callback for the asyncExpect,
  // so it will run after async validateFields in componentDidMount. Possible race condition.
  // Its done because, currently, rc-form createBaseForm.js queues async console.error
  // in case validation found any errors on the form. This is done, so console.error will not cause test to fail.
  await asyncExpect()

  restoreConsole()
}

describe('Component: Form', () => {
  let defaultProps
  let wrapper

  const inputAKey = 'inputA'
  let inputAConfig

  const inputBKey = 'inputB'
  let inputBConfig

  // const expectErrorMessageDisplayedAfterRenderWithProps = async (props, isDisplayed) => {
  //   await withMutedConsole(async () => {
  //     const requireValidator = new RequiredValidator()
  //     props.fields[inputAKey].validators = [
  //       requireValidator
  //     ]
  //     const formWrapper = await mount(<Form {...props} />)
  //     const inputAWrapper = formWrapper.find(AntdForm.Item).at(0)
  //     const errorMessageDisplayed = inputAWrapper.text().indexOf(requireValidator.message) > 0
  //     expect(errorMessageDisplayed).toBe(isDisplayed)
  //   })
  // }

  beforeEach(() => {
    inputAConfig = {
      label: 'input a label',
      render: jest.fn(() => <Input />),
      visible: jest.fn(() => true),
    }

    inputBConfig = {
      label: 'input b label',
      render: jest.fn(() => <Input />),
      initialValue: 'field b value',
      visible: jest.fn(() => true),
    }

    defaultProps = {
      fields: {
        [inputAKey]: inputAConfig,
        [inputBKey]: inputBConfig,
      },
      validateOnMount: false,
      hideErrorsForUntouchedFields: false,
      onFieldsChange: jest.fn(),
    }

    wrapper = shallow(<CustomForm {...defaultProps} />)
  })

  it('should render correct layout based on the props', () => {
    expect(wrapper.dive()).toMatchSnapshot()
  })

  // TODO: #2208
  // it('should validate the form after rendering if validateOnMount set to true', async () => {
  //   defaultProps.validateOnMount = true
  //   await expectErrorMessageDisplayedAfterRenderWithProps(defaultProps, true)
  // })

  // it('should hide validation errors if user didn`t touch fields when hideErrorsForUntouchedFields set to true', async () => {
  //   defaultProps.validateOnMount = true
  //   defaultProps.hideErrorsForUntouchedFields = true
  //
  //   await expectErrorMessageDisplayedAfterRenderWithProps(defaultProps, false)
  // })

  it('should call onFieldsChanged if input field value changed', () => {
    const formWrapper = mount(<CustomForm {...defaultProps} />)
    const value = 'new_value'
    const event = getChangeEvent(value)

    formWrapper.find(`#${inputAKey} input`).simulate('change', event)

    expect(defaultProps.onFieldsChange).toHaveBeenCalledWith(
      expect.objectContaining({
        [inputAKey]: value,
      }),
      [],
    )
  })

  it('should pass validation errors to the onFieldsChange callback', async () => {
    await withMutedConsole(async () => {
      const validator = new RequiredValidator()
      defaultProps.validateOnMount = true
      defaultProps.fields[inputAKey].validators = [validator]
      await mount(<CustomForm {...defaultProps} />)
      await flushPromises()
      const errors = defaultProps.onFieldsChange.mock.calls[0][1]
      expect(errors).toEqual([validator.message])
    })
  })

  it('should call field`s visible callback when rendering', () => {
    wrapper.dive()

    expect(inputAConfig.visible).toHaveBeenCalled()
    expect(inputBConfig.visible).toHaveBeenCalled()
  })

  it('should not render the field if visible callback returns false', () => {
    inputAConfig.visible = jest.fn(() => false)
    const formWrapper = mount(<CustomForm {...defaultProps} />)

    expect(formWrapper.find('label')).toHaveLength(1)
    expect(formWrapper.find('label').text()).toEqual(inputBConfig.label)
  })

  it('should not render the field if visible is a boolean value and is set to false', () => {
    inputAConfig.visible = true
    inputBConfig.visible = false

    const formWrapper = mount(<CustomForm {...defaultProps} />)

    expect(formWrapper.find('label')).toHaveLength(1)
    expect(formWrapper.find('label').text()).toEqual(inputAConfig.label)
  })
})
