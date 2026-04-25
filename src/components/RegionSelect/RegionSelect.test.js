
import { mockReact } from '@/mocks/mockReact'
import { shallow } from 'enzyme'
import { WindowListener } from '@/components/WindowListener'
import { theme } from '@/theme/theme.default'
import { BorderSide, RegionSelect } from './RegionSelect'

jest.mock('react', () =>
  mockReact({
    mockCreateRef: () => ({
      current: {
        getBoundingClientRect: jest.fn(() => ({
          left: 30,
          top: 50,
        })),
        firstChild: {
          offsetHeight: 20,
          offsetWidth: 10,
        },
      },
    }),
  }),
)

describe('Component: RegionSelect', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      constraint: false,
      maxRegions: 1,
      regions: [
        {
          x: 10,
          y: 15,
        },
      ],
      onMove: jest.fn(),
      onCreate: jest.fn(),
      onResize: jest.fn(),
      onUpdate: jest.fn(),
      onChange: jest.fn(),
      regionStyle: {
        zIndex: 5,
        borderColor: theme.color.errorDark,
        background: theme.color.region,
      },
      regionRenderer: jest.fn(),
    }
    wrapper = shallow(<RegionSelect {...defaultProps} />)
    wrapper = wrapper.dive()
  })

  it('should render layout correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onChange prop with expected values when calling WindowListener onMouseMove', () => {
    wrapper.setProps({
      onUpdate: undefined,
    })
    const WindowListenerWrapper = wrapper.find(WindowListener)

    const mockClickEventDown = {
      clientX: 100,
      clientY: 150,
      target: {
        dataset: {
          regionIndex: '0',
          borderSide: 0,
        },
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    }
    WindowListenerWrapper.props().onMouseDown(mockClickEventDown)

    const mockClickEventMove = {
      clientX: 200,
      clientY: 250,
    }
    WindowListenerWrapper.props().onMouseMove(mockClickEventMove)

    const expectedArg = [
      {
        isChanging: true,
        x: 1010,
        y: 515,
      },
    ]
    expect(defaultProps.onChange).nthCalledWith(1, expectedArg)
  })

  it('should correctly call onChange prop with a resized region up', () => {
    wrapper.setProps({
      onUpdate: undefined,
      regions: [
        {
          x: 10,
          y: 55,
          height: 30,
        },
      ],
    })
    const WindowListenerWrapper = wrapper.find(WindowListener)

    const mockClickEventDown = {
      clientX: 100,
      clientY: 150,
      target: {
        dataset: {
          regionIndex: '0',
          borderSide: BorderSide.UP,
        },
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    }
    WindowListenerWrapper.props().onMouseDown(mockClickEventDown)

    const mockClickEventMove = {
      clientX: 200,
      clientY: 250,
    }
    WindowListenerWrapper.props().onMouseMove(mockClickEventMove)
    const expectedRegion = [{
      height: 0,
      isChanging: true,
      x: 10,
      y: 85,
    }]

    expect(defaultProps.onChange).nthCalledWith(1, expectedRegion)
  })

  it('should correctly call onChange prop with a resized region down', () => {
    wrapper.setProps({
      onUpdate: undefined,
      regions: [
        {
          x: 10,
          y: 55,
          height: 30,
        },
      ],
    })
    const WindowListenerWrapper = wrapper.find(WindowListener)

    const mockClickEventDown = {
      clientX: 100,
      clientY: 150,
      target: {
        dataset: {
          regionIndex: '0',
          borderSide: BorderSide.DOWN,
        },
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    }
    WindowListenerWrapper.props().onMouseDown(mockClickEventDown)

    const mockClickEventMove = {
      clientX: 200,
      clientY: 250,
    }
    WindowListenerWrapper.props().onMouseMove(mockClickEventMove)
    const expectedRegion = [{
      height: 45,
      isChanging: true,
      x: 10,
      y: 55,
    }]

    expect(defaultProps.onChange).nthCalledWith(1, expectedRegion)
  })

  it('should correctly call onChange prop with a resized region left', () => {
    wrapper.setProps({
      onUpdate: undefined,
      regions: [
        {
          x: 10,
          y: 55,
          width: 30,
        },
      ],
    })
    const WindowListenerWrapper = wrapper.find(WindowListener)

    const mockClickEventDown = {
      clientX: 100,
      clientY: 150,
      target: {
        dataset: {
          regionIndex: '0',
          borderSide: BorderSide.LEFT,
        },
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    }
    WindowListenerWrapper.props().onMouseDown(mockClickEventDown)

    const mockClickEventMove = {
      clientX: 200,
      clientY: 250,
    }
    WindowListenerWrapper.props().onMouseMove(mockClickEventMove)
    const expectedRegion = [{
      width: 0,
      isChanging: true,
      x: 40,
      y: 55,
    }]

    expect(defaultProps.onChange).nthCalledWith(1, expectedRegion)
  })

  it('should correctly call onChange prop with a resized region right', () => {
    wrapper.setProps({
      onUpdate: undefined,
      regions: [
        {
          x: 10,
          y: 55,
          width: 30,
        },
      ],
    })
    const WindowListenerWrapper = wrapper.find(WindowListener)

    const mockClickEventDown = {
      clientX: 100,
      clientY: 150,
      target: {
        dataset: {
          regionIndex: '0',
          borderSide: BorderSide.RIGHT,
        },
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    }
    WindowListenerWrapper.props().onMouseDown(mockClickEventDown)

    const mockClickEventMove = {
      clientX: 200,
      clientY: 250,
    }
    WindowListenerWrapper.props().onMouseMove(mockClickEventMove)
    const expectedRegion = [{
      width: 90,
      isChanging: true,
      x: 10,
      y: 55,
    }]

    expect(defaultProps.onChange).nthCalledWith(1, expectedRegion)
  })

  it('should call onChange prop with the array of regions with the property isChanging set to false', () => {
    wrapper.setProps({
      onUpdate: undefined,
      regions: [
        {
          x: 10,
          y: 55,
          height: 30,
        },
      ],
    })
    const WindowListenerWrapper = wrapper.find(WindowListener)

    const mockClickEventDown = {
      clientX: 100,
      clientY: 150,
      target: {
        dataset: {
          regionIndex: '0',
          borderSide: BorderSide.DOWN,
        },
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    }
    WindowListenerWrapper.props().onMouseDown(mockClickEventDown)

    const mockClickEventMove = {
      clientX: 200,
      clientY: 250,
    }
    WindowListenerWrapper.props().onMouseMove(mockClickEventMove)
    wrapper.setProps({
      regions: [{
        height: 45,
        isChanging: true,
        x: 10,
        y: 55,
      }],
    })
    WindowListenerWrapper.props().onMouseUp()

    expect(defaultProps.onChange).nthCalledWith(1, [{
      height: 45,
      isChanging: true,
      x: 10,
      y: 55,
    }])
    expect(defaultProps.onChange).nthCalledWith(2, [{
      height: 45,
      isChanging: false,
      x: 10,
      y: 55,
    }])
  })

  it('should return false if one of the arguments is a falsy value when calling isMoving', () => {
    const result = wrapper.instance().isMoving({}, false)
    expect(result).toBe(false)
  })

  it('should return false if one of the arguments is a falsy value when calling isResizing', () => {
    const result = wrapper.instance().isResizing({}, false)
    expect(result).toBe(false)
  })

  it('should call onCreate prop if changedRegion is new', () => {
    const changedRegion = {
      height: 45,
      new: true,
      x: 10,
      y: 55,
    }

    wrapper.instance().onCreateMoveResizeUpdate(changedRegion)
    expect(defaultProps.onCreate).nthCalledWith(1, changedRegion)
  })

  it('should call onUpdate prop if changedRegion is not resizing or moving', () => {
    const changedRegion = {
      height: 45,
      x: 10,
      y: 55,
      data: {
        index: 2,
      },
    }

    wrapper.setProps({
      regions: [{
        height: 45,
        x: 10,
        y: 55,
        data: {
          index: 2,
        },
      }],
    })

    wrapper.instance().onCreateMoveResizeUpdate(changedRegion)
    expect(defaultProps.onUpdate).nthCalledWith(1, changedRegion)
  })
})
