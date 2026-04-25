/* eslint-disable testing-library/no-render-in-setup */

import { mockEnv } from '@/mocks/mockEnv'
import { mount } from 'enzyme'
import ReactDOM from 'react-dom'
import { externalOneTimeRender } from '@/utils/externalOneTimeRender'

let Component

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  render: jest.fn((c) => {
    Component = c
  }),
  unmountComponentAtNode: jest.fn(),
}))

jest.mock('@/utils/env', () => mockEnv)

describe('util: externalOneTimeRender', () => {
  let wrapper
  const InnerComponent = () => <div>Hello Mock inner component</div>
  const props = {
    onOk: jest.fn((...args) => Promise.resolve(...args)),
    onCancel: jest.fn((...args) => Promise.resolve(...args)),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    externalOneTimeRender(
      (props) => (
        <InnerComponent
          onCancel={props.onCancel}
          onOk={props.onOk}
        />
      ),
      props,
    )
    wrapper = mount(Component)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call props.onOk with correct arguments in case calling to onOk prop from inner component', async () => {
    const innerComponentProps = wrapper.find(InnerComponent).props()
    await innerComponentProps.onOk('onOkArg')
    expect(props.onOk).nthCalledWith(1, 'onOkArg')
  })

  it('should call props.onCancel with correct arguments in case calling to onCancel prop from inner component', async () => {
    const innerComponentProps = wrapper.find(InnerComponent).props()
    await innerComponentProps.onCancel('onCancelArg')
    expect(props.onCancel).nthCalledWith(1, 'onCancelArg')
  })

  it('should call ReactDOM.unmountComponentAtNode once in case calling to onOk prop from inner component', async () => {
    const innerComponentProps = wrapper.find(InnerComponent).props()
    await innerComponentProps.onOk('onOkArg')
    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(1)
  })

  it('should call ReactDOM.unmountComponentAtNode once in case calling to onCancel prop from inner component', async () => {
    const innerComponentProps = wrapper.find(InnerComponent).props()
    await innerComponentProps.onCancel('onCancelArg')
    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledTimes(1)
  })
})
