
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { useStateRef } from '@/hooks/useStateRef'
import { useExpandableText } from './'

jest.mock('@/utils/env', () => mockEnv)

let mockCalled = false
let mockRowsHeight = 1

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (effect) => {
    if (!mockCalled) {
      mockCalled = true
      return effect()
    }
  },
}))
jest.mock('@/utils/getComputedStyle', () => ({
  getComputedStyle: jest.fn().mockImplementation(() => mockRowsHeight),
}))
jest.mock('@/hooks/useMutationObserver', () => ({
  useMutationObserver: jest.fn(),
}))
jest.mock('@/hooks/useStateRef', () => ({
  useStateRef: jest.fn(() => [mockElement, jest.fn()]),
}))

const mockElement = {
  firstChild: {
    scrollHeight: 100,
    style: {
      height: 0,
      overflowY: 0,
    },
  },
}

const HookWrapper = () => <div {...useExpandableText()} />

describe('Hook: useExpandableText', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallow(<HookWrapper />)
  })

  it('should render the correct layout for ExpandableContainer', () => {
    const { ExpandableContainer } = wrapper.props()
    const textToExpandCollapse = <div>text</div>
    const container = shallow(
      <ExpandableContainer>
        {textToExpandCollapse}
      </ExpandableContainer>,
    )
    expect(container).toMatchSnapshot()
  })

  it('should render the correct layout for ToggleExpandIcon', () => {
    const { ToggleExpandIcon } = wrapper.props()
    expect(ToggleExpandIcon()).toMatchSnapshot()
  })

  it('should change isFieldExpanded when click the ToggleExpandIcon', () => {
    const { ToggleExpandIcon } = wrapper.props()
    ToggleExpandIcon().props.onClick()
    expect(wrapper.props().ToggleExpandIcon().props.$isRotated).toBe(true)
  })

  it('should not render ToggleExpandIcon in case scrollHeight lower than currentRowsHeight', () => {
    mockRowsHeight = 200
    mockCalled = false
    wrapper.setProps()
    const { ToggleExpandIcon } = wrapper.props()
    const toggleIcon = shallow(<ToggleExpandIcon />)
    expect(toggleIcon.find('ArrowDownFilledIcon').exists()).toBe(false)
  })

  it('should render ToggleExpandIcon in case scrollHeight lower than currentRowsHeight', () => {
    const HookWrapperWithRowsQuantity = () => <div {...useExpandableText(5)} />

    mockRowsHeight = 10
    mockCalled = false
    wrapper = shallow(<HookWrapperWithRowsQuantity />)
    const { ToggleExpandIcon } = wrapper.props()
    const toggleIcon = shallow(<ToggleExpandIcon />)
    expect(toggleIcon.find('ArrowDownFilledIcon').exists()).toBe(true)
  })

  it('should not updated isRotated in case element are absent', () => {
    const currentIsRotated = wrapper.props().ToggleExpandIcon().props.$isRotated
    mockRowsHeight = 200

    useStateRef.mockImplementationOnce(() => [null, jest.fn()])

    mockCalled = false
    wrapper.setProps()
    const { ToggleExpandIcon } = wrapper.props()
    expect(ToggleExpandIcon().props.$isRotated).toEqual(currentIsRotated)
  })
})
