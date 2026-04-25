
import { shallow } from 'enzyme'
import { useDrag, useDrop } from 'react-dnd'
import { Placement } from '@/enums/Placement'
import { Draggable } from './Draggable'

jest.mock('react-dnd', () => ({
  useDrag: jest.fn(),
  useDrop: jest.fn(),
}))

describe('Component: Draggable', () => {
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      index: 1,
      type: 'draggable',
      className: 'className',
      onDrop: jest.fn(),
      onMove: jest.fn(),
      onDragEnd: jest.fn(),
    }
  })

  it('should correct render default state of Draggable component', () => {
    useDrag.mockImplementationOnce(() => [{ isDragging: false }, jest.fn()])
    useDrop.mockImplementationOnce(() => [{}, jest.fn()])

    expect(
      shallow(
        <Draggable {...defaultProps}>
          <span>Mock element</span>
        </Draggable>,
      ),
    ).toMatchSnapshot()
  })

  it('should correct render upward state of Draggable component is not over', () => {
    useDrag.mockImplementationOnce(() => [{ isDragging: false }, jest.fn()])
    useDrop.mockImplementationOnce(() => [
      {
        isOver: false,
        borderPlacement: Placement.TOP,
      },
      jest.fn(),
    ])

    expect(
      shallow(
        <Draggable {...defaultProps}>
          <span>Mock element</span>
        </Draggable>,
      ),
    ).toMatchSnapshot()
  })

  it('should correct render downward state if Draggable component is over', () => {
    useDrag.mockImplementationOnce(() => [{ isDragging: false }, jest.fn()])
    useDrop.mockImplementationOnce(() => [
      {
        isOver: true,
        borderPlacement: Placement.BOTTOM,
      },
      jest.fn(),
    ])

    expect(
      shallow(
        <Draggable {...defaultProps}>
          <span>Mock element</span>
        </Draggable>,
      ),
    ).toMatchSnapshot()
  })

  it('should correct render drag state of Draggable component', () => {
    useDrag.mockImplementationOnce(() => [{ isDragging: true }, jest.fn()])
    useDrop.mockImplementationOnce(() => [{}, jest.fn()])

    expect(
      shallow(
        <Draggable {...defaultProps}>
          <span>Mock element</span>
        </Draggable>,
      ),
    ).toMatchSnapshot()
  })
})
