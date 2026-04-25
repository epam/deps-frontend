
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Button } from '@/components/Button'
import { ComponentSize } from '@/enums/ComponentSize'
import { ModalButton } from './ModalButton'
import { Modal } from './ModalButton.styles'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ModalButton', () => {
  let wrapper
  let defaultProps

  const modalChildren = [
    <div key="1" />,
    <div key="2" />,
  ]

  beforeEach(() => {
    defaultProps = {
      size: ComponentSize.SMALL,
      title: 'sample title',
      okButtonProps: {
        text: 'ok button text',
        disabled: false,
      },
      renderOpenTrigger: jest.fn(),
      onOk: jest.fn(),
      onOpen: jest.fn(),
      onClose: jest.fn(),
      children: modalChildren,
      fetching: false,
    }

    wrapper = shallow(<ModalButton {...defaultProps} />)
  })

  it('should render open button with correct props', () => {
    const instance = wrapper.instance()

    expect(defaultProps.renderOpenTrigger).toHaveBeenCalledWith(instance.open)
  })

  it('should render default open button when renderOpenTrigger is undefined', () => {
    wrapper.setProps({
      ...defaultProps,
      renderOpenTrigger: undefined,
    })
    const instance = wrapper.instance()
    const buttonProps = wrapper.find(Button.Text).props()

    expect(buttonProps.onClick).toEqual(instance.open)
    expect(buttonProps.children).toEqual('Open')
  })

  it('should render antd Modal with correct props', () => {
    const instance = wrapper.instance()
    const modalProps = wrapper.find(Modal).props()

    expect(modalProps.centered).toBeDefined()
    expect(modalProps.title).toBe(defaultProps.title)
    expect(modalProps.onCancel).toEqual(instance.close)
    expect(modalProps.children).toEqual(null)
    expect(modalProps.size).toEqual(defaultProps.size)
    expect(modalProps.footer).toEqual([instance.renderCancel(), instance.renderOk()])
  })

  it('should render modal children after modal was opened', async () => {
    await wrapper.instance().open()

    expect(wrapper.find(Modal).props().children).toEqual(modalChildren)
  })

  it('should render cancel button in the modal footer', () => {
    const [cancel] = wrapper.find(Modal).props().footer

    expect(cancel).toBeDefined()
    expect(cancel.props.children).toEqual('Cancel')
    expect(cancel.props.onClick).toEqual(wrapper.instance().close)
  })

  it('should render ok button in the modal footer of onOk prop is defined', () => {
    const [, ok] = wrapper.find(Modal).props().footer

    expect(ok).toBeDefined()
    expect(ok.props.children).toEqual(defaultProps.okButtonProps.text)
    expect(ok.props.onClick).toEqual(wrapper.instance().onOk)
    expect(ok.props.disabled).toEqual(defaultProps.okButtonProps.disabled)
  })

  it('should not render ok button if onOk is not defined', () => {
    defaultProps.onOk = undefined
    wrapper = shallow(<ModalButton {...defaultProps} />)

    const [, ok] = wrapper.find(Modal).props().footer

    expect(ok).not.toBeDefined()
  })

  it('should call props.renderFooter if it`s passed to the component', () => {
    defaultProps.renderFooter = jest.fn()
    wrapper = shallow(<ModalButton {...defaultProps} />)
    expect(defaultProps.renderFooter).toHaveBeenCalled()
  })

  it('should toggle antd Modal ok button disabled based on the okButtonProps', () => {
    defaultProps.okButtonProps.disabled = true
    wrapper = shallow(<ModalButton {...defaultProps} />)

    const [, ok] = wrapper.find(Modal).props().footer

    expect(ok.props.disabled).toEqual(defaultProps.okButtonProps.disabled)
  })

  it('should hide antd Modal by default', () => {
    expect(wrapper.find(Modal).props().open).toBe(false)
  })

  it('should set antd Modal open prop to true after calling to open', async () => {
    await wrapper.instance().open()

    expect(wrapper.find(Modal).props().open).toBe(true)
  })

  it('should set antd Modal open prop to false after calling to close', () => {
    wrapper.instance().open()
    wrapper.instance().close()

    expect(wrapper.find(Modal).props().open).toBe(false)
  })

  it('should set antd Modal open prop to false after calling to save', async () => {
    await wrapper.instance().open()
    await wrapper.instance().onOk()

    expect(wrapper.find(Modal).props().open).toBe(false)
  })

  it('should call to onOk from save handler', async () => {
    await wrapper.instance().onOk()

    expect(defaultProps.onOk).toHaveBeenCalledTimes(1)
  })

  it('should call to onOpen from open handler', () => {
    wrapper.instance().open()

    expect(defaultProps.onOpen).toHaveBeenCalledTimes(1)
  })

  it('should call to onClose from close handler', () => {
    wrapper.instance().close()

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should cancel saving if false returned from onOk callback', async () => {
    defaultProps.onOk = jest.fn(() => true)
    wrapper.setProps(defaultProps)
    await wrapper.instance().open()
    await wrapper.instance().onOk()

    expect(wrapper.find(Modal).props().open).toBe(true)
  })

  it('should cancel opening if false returned from onOpen callback', () => {
    defaultProps.onOpen = jest.fn(() => true)
    wrapper.setProps(defaultProps)
    wrapper.instance().open()

    expect(wrapper.find(Modal).props().open).toBe(false)
  })
})
