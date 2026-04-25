
import { shallow } from 'enzyme'
import { WindowListener } from '.'

describe('Component: WindowListener', () => {
  window.addEventListener = jest.fn()
  window.removeEventListener = jest.fn()

  let defaultProps, wrapper

  beforeEach(() => {
    defaultProps = {
      onMouseDown: jest.fn(),
      onMouseUp: jest.fn(),
      onMouseMove: jest.fn(),
      onKeyDown: jest.fn(),
      onKeyUp: jest.fn(),
    }
    wrapper = shallow(<WindowListener {...defaultProps} />)
  })

  it('should not render anything', () => {
    expect(wrapper.isEmptyRender()).toEqual(true)
  })

  it('should add listeners to the window', () => {
    expect(window.addEventListener).toHaveBeenCalledWith('mousedown', defaultProps.onMouseDown)
    expect(window.addEventListener).toHaveBeenCalledWith('mouseup', defaultProps.onMouseUp)
    expect(window.addEventListener).toHaveBeenCalledWith('mousemove', defaultProps.onMouseMove)
    expect(window.addEventListener).toHaveBeenCalledWith('keydown', defaultProps.onKeyDown)
    expect(window.addEventListener).toHaveBeenCalledWith('keyup', defaultProps.onKeyUp)
  })

  it('should remove listeners from the window', () => {
    wrapper.unmount()
    expect(window.removeEventListener).toHaveBeenCalledWith('mousedown', defaultProps.onMouseDown)
    expect(window.removeEventListener).toHaveBeenCalledWith('mouseup', defaultProps.onMouseUp)
    expect(window.removeEventListener).toHaveBeenCalledWith('mousemove', defaultProps.onMouseMove)
    expect(window.removeEventListener).toHaveBeenCalledWith('keydown', defaultProps.onKeyDown)
    expect(window.removeEventListener).toHaveBeenCalledWith('keyup', defaultProps.onKeyUp)
  })
})
