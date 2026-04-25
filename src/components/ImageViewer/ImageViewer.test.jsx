
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Button } from '@/components/Button'
import { ImageViewer } from './ImageViewer'
import { RelativeWrapper, Slider } from './ImageViewer.styles'
import { ResizableCanvas } from './ResizableCanvas'

const mockEvent = {
  preventDefault: jest.fn(),
}

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ImageViewer', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      renderOverlay: jest.fn((overlay) => overlay),
      imageUrl: 'http://mock.png',
      fetching: false,
      isFixedSize: false,
      scaling: true,
      polygons: [],
      onRotate: jest.fn(),
      renderPageSwitcher: jest.fn(),
    }

    wrapper = shallow(<ImageViewer {...defaultProps} />)
  })

  it('should render ImageViewer with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render RelativeWrapper if isFixedSize is set to true', () => {
    wrapper.setProps({
      ...defaultProps,
      isFixedSize: true,
    })

    const relativeWrapper = wrapper.find(RelativeWrapper)

    expect(relativeWrapper.exists()).toEqual(true)
  })

  it('should update rotationAngle when calling onRotateLeft and onRotateRight', () => {
    const [,,,,, rotateLeftButton, rotateRightButton] = wrapper.find(Button.Icon)
    const { onClick: onRotateLeft } = rotateLeftButton.props
    const { onClick: onRotateRight } = rotateRightButton.props

    expect(wrapper.find(ResizableCanvas).props().rotationAngle).toEqual(0)

    onRotateLeft(mockEvent)
    expect(wrapper.find(ResizableCanvas).props().rotationAngle).toEqual(-90)

    onRotateRight(mockEvent)
    expect(wrapper.find(ResizableCanvas).props().rotationAngle).toEqual(90)
  })

  it('should update scaleFactor correctly in case of calling scaleConfig onChange prop on the ResizableCanvas', () => {
    const { scaleConfig } = wrapper.find(ResizableCanvas).props()
    const mockScale = 1.1
    scaleConfig.onChange(1.1)

    const scaleFactor = wrapper.find(Slider).props().value

    expect(scaleFactor).toEqual(mockScale * 100)
  })
})
