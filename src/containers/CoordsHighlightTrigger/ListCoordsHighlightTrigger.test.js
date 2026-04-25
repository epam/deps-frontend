
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Button } from '@/components/Button'
import { Rect } from '@/models/Rect'
import { documentSelector } from '@/selectors/documentReviewPage'
import { Menu, Badge } from './CoordsHighlightTrigger.styles'
import { ListCoordsHighlightTrigger } from '.'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')

const mockDefaultCoord = {
  page: 1,
  coordinates: [[1, 2]],
}

describe('Component: ListCoordsHighlightTrigger', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    defaultProps = {
      coords: [
        {
          page: 1,
          coordinates: [new Rect(1, 2, 3, 4)],
        },
        {
          page: 2,
          coordinates: [
            new Rect(2, 3, 4, 5),
            new Rect(5, 6, 7, 8),
          ],
        },
      ],
      highlightArea: jest.fn(),
      document: documentSelector.getSelectorMockValue(),
    }

    wrapper = shallow(<ListCoordsHighlightTrigger {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout with table coordinates', () => {
    defaultProps.coords = [
      mockDefaultCoord,
      {
        page: 2,
        coordinates: [
          [2, 3, 4, 5],
          [6, 7],
        ],
      },
    ]

    wrapper.setProps(defaultProps)

    expect(wrapper).toMatchSnapshot()
  })

  it('should call highlightArea after click on button if only one coord in coords', () => {
    defaultProps.coords = [
      mockDefaultCoord,
    ]

    wrapper.setProps(defaultProps)
    wrapper.find(Button.Icon).props().onClick()

    expect(defaultProps.highlightArea).nthCalledWith(
      1,
      mockDefaultCoord.coordinates,
      mockDefaultCoord.page,
      undefined,
    )
  })

  it('should not call highlightArea after click on button if there are many coords', () => {
    wrapper.setProps(defaultProps)
    wrapper.find(Button.Icon).props().onClick()

    expect(defaultProps.highlightArea).not.toHaveBeenCalled()
  })

  it('should correctly render Menu Option', () => {
    const menuOption = wrapper.find(Menu).props().items[0].content()
    const renderedMenuOption = shallow(<div>{menuOption}</div>)

    expect(renderedMenuOption).toMatchSnapshot()
  })

  it('should call highlightedField when click on Option', () => {
    const menuOption = wrapper.find(Menu).props().items[0].content()

    menuOption.props.onClick()

    expect(defaultProps.highlightArea).toHaveBeenCalled()
  })

  it('should count prop of Badge Component should be zero if there is one coord in coords', () => {
    defaultProps.coords = [
      mockDefaultCoord,
    ]

    wrapper.setProps(defaultProps)
    const count = wrapper.find(Badge).props().count

    expect(count).toBe(0)
  })

  it('should call highlightArea function with right parameters if page not exist in coords', () => {
    defaultProps.coords = [
      {
        sourceId: 'c626d5ee3c964e31aaf2e2c7170823ba',
        coordinates: [new Rect(1, 2, 3, 4)],
      },
      {
        sourceId: 'dadasdqe',
        coordinates: [
          new Rect(2, 3, 4, 5),
          new Rect(5, 6, 7, 8),
        ],
      },
    ]

    wrapper.setProps(defaultProps)
    const menuOption = wrapper.find(Menu).props().items[0].content()
    menuOption.props.onClick()

    expect(defaultProps.highlightArea).toHaveBeenCalledWith(defaultProps.coords[0].coordinates, undefined, defaultProps.coords[0].sourceId)
  })
})
