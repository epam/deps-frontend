
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactSizeMe } from '@/mocks/mockReactSizeMe'
import { shallow } from 'enzyme'
import { renderCell } from './Cell'
import { StyledHotTable } from './HandsonTable.styles'
import {
  HandsonTable,
  HTCell,
  HTMerge,
  HTColumn,
  SEPARATOR,
  ContextMenuItem,
} from '.'

const mockData = [
  {
    0: new HTCell(
      '0 0',
      { confidence: 0.01 },
    ),
    1: new HTCell(
      '0 1',
      { confidence: 0.02 },
    ),
  },
  {
    0: new HTCell(
      '1 0',
      { confidence: 0.10 },
    ),
  }]
const mockMergedCells = []
const mockRanges = [[0, 1, 1, 2], [[0, 0]]]

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    paddingTop: '5px',
    paddingBottom: '5px',
  }),
})

const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()
const mockQuerySelector = jest.fn()
const mockScrollBy = jest.fn()

window.scrollBy = mockScrollBy

jest.mock('react', () => mockReact({
  mockCreateRef: () => ({
    current: {
      hotInstance: {
        container: {
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
          querySelector: mockQuerySelector,
        },
        getSettings: jest.fn(),
        updateSettings: jest.fn(),
        getSourceData: jest.fn(() => mockData),
        getSelectedRange: jest.fn(() => mockRanges),
        selectCells: jest.fn(),
        scrollViewportTo: jest.fn(),
        getPlugin: jest.fn(() => ({
          mergedCellsCollection: {
            mergedCells: mockMergedCells,
          },
          enablePlugin: jest.fn(),
          disablePlugin: jest.fn(),
          recalculateAllRowsHeight: jest.fn(),
          getColumnHeaderHeight: jest.fn(() => 25),
          heights: [23, 23, 23],
        })),
      },
      hotElementRef: {
        offsetParent: {
          offsetHeight: 114,
          offsetTop: 90,
          getBoundingClientRect: jest.fn(() => ({
            top: 10,
          })),
        },
        parentNode: {
          paddingTop: '5px',
          paddingBottom: '5px',
        },
      },
    },
  }),
}))

jest.mock('react-sizeme', () => mockReactSizeMe({
  size: {
    width: 300,
    height: 300,
  },
}))

jest.mock('./Cell', () => ({
  renderCell: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Component: HandsonTable', () => {
  let defaultProps
  let wrapper
  let htProps
  const mockExtra = <div>mock extra box</div>
  const EventSource = {
    EDIT: 'edit',
    LOAD_DATA: 'loadData',
    POPULATE_FROM_ARRAY: 'populateFromArray',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      activePage: 1,
      addColumnsCoords: jest.fn(),
      onChangeData: jest.fn(),
      defaultContextMenuItems: [
        ContextMenuItem.CUT,
        SEPARATOR,
      ],
      extraCtxMenuConfig: [{
        name: 'mock',
        callback: jest.fn(),
      }],
      columns: [
        new HTColumn('0.value'),
        new HTColumn('1.value'),
      ],
      addRowsCoords: jest.fn(),
      data: mockData,
      mergeCells: [
        new HTMerge(0, 1, 2, 1),
      ],
      propsForUpdate: ['readOnly', 'selectedRanges', 'forceRerenderProps'],
      onAfterCreateCol: jest.fn(),
      onAfterCreateRow: jest.fn(),
      onAfterRemoveCol: jest.fn(),
      onAfterRemoveRow: jest.fn(),
      onSelectRange: jest.fn(),
      readOnly: false,
      removeColumnsCoords: jest.fn(),
      contextMenuEnabled: true,
      removeRowsCoords: jest.fn(),
      renderExtra: jest.fn(() => mockExtra),
      saveData: jest.fn(),
      selectedRanges: [[0, 1]],
    }

    wrapper = shallow(<HandsonTable {...defaultProps} />)
    htProps = wrapper.find(StyledHotTable).props()
  })

  it('should render correct layout', () => {
    expect(wrapper.dive()).toMatchSnapshot()
  })

  it('should set readonly to true in case of props.readOnly is true', () => {
    defaultProps.readOnly = true
    wrapper.setProps(defaultProps)
    const { readOnly } = wrapper.find(StyledHotTable).props()
    expect(readOnly).toEqual(true)
  })

  it('should call props.saveData only in case of EventSource is `edit` and calling afterChange handsonTable hook', () => {
    const cellChange = [0, 0, 'old value', 'new value']

    Object.values(EventSource).forEach((s) => {
      htProps.afterChange([cellChange], s)
      if (s === EventSource.EDIT) {
        expect(defaultProps.saveData).nthCalledWith(1, mockData, mockMergedCells, [cellChange])
        jest.clearAllMocks()
      } else {
        expect(defaultProps.saveData).not.toHaveBeenCalled()
      }
    })
  })

  it('should call props.onChangeData only in case of EventSource is `edit` and calling beforeChange handsonTable hook', () => {
    Object.values(EventSource).forEach((s) => {
      const changes = []
      htProps.beforeChange(changes, s)
      if (s === EventSource.EDIT) {
        expect(defaultProps.onChangeData).nthCalledWith(1, changes)
        jest.clearAllMocks()
      } else {
        expect(defaultProps.onChangeData).not.toHaveBeenCalled()
      }
    })
  })

  it('should call props.onSelectRange and props.addColumnsCoords in case of calling afterSelectionEnd handsonTable hook', () => {
    htProps.afterSelectionEnd()
    expect(defaultProps.onSelectRange).nthCalledWith(1, mockRanges)
  })

  it('should call props.saveData and props.onAfterCreateCol in case of calling afterCreateCol handsonTable hook', () => {
    htProps.afterCreateCol(0, 2)
    expect(defaultProps.onAfterCreateCol).nthCalledWith(1, 0, 2)
    expect(defaultProps.saveData).nthCalledWith(1, mockData, mockMergedCells, undefined)
  })

  it('should call props.saveData and props.onAfterCreateRow in case of calling afterCreateRow handsonTable hook', () => {
    htProps.afterCreateRow(0, 2)
    expect(defaultProps.onAfterCreateRow).nthCalledWith(1, 0, 2)
    expect(defaultProps.saveData).nthCalledWith(1, mockData, mockMergedCells, undefined)
  })

  it('should call props.saveData and props.onAfterRemoveCol in case of calling afterRemoveCol handsonTable hook', () => {
    htProps.afterRemoveCol(0, 2)
    expect(defaultProps.onAfterRemoveCol).nthCalledWith(1, 0, 2)
    expect(defaultProps.saveData).nthCalledWith(1, mockData, mockMergedCells, undefined)
  })

  it('should call props.saveData and props.onAfterRemoveRow in case of calling afterRemoveRow handsonTable hook', () => {
    htProps.afterRemoveRow(0, 2)
    expect(defaultProps.onAfterRemoveRow).nthCalledWith(1, 0, 2)
    expect(defaultProps.saveData).nthCalledWith(1, mockData, mockMergedCells, undefined)
  })

  it('should call props.renderExtra and renderCell in case of calling cell renderer handsonTable', () => {
    wrapper.instance().isCellShouldBeRendered = jest.fn(() => true)
    const instance = {
      rootElement: {
        id: 'id',
      },
    }
    const td = 'td'
    const row = 0
    const col = 0
    const prop = 'prop'
    const value = '100500'
    const cellProps = 'cellProps'
    htProps.renderer(instance, td, row, col, prop, value, cellProps)
    expect(defaultProps.renderExtra).nthCalledWith(1, 0, 0, mockData, instance.rootElement)
    expect(renderCell).nthCalledWith(1, td, value, cellProps, mockExtra)
  })

  it('should call selectCells with correct arguments', () => {
    jest.clearAllMocks()
    wrapper.setProps({
      ...defaultProps,
      selectedRanges: [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [0, 0, 1, 1]],
    })
    const expected = [[0, 0, 1, 1], [0, 0, 2, 0], [0, 1, 0, 2]]
    expect(wrapper.instance().ht.selectCells).nthCalledWith(1, expected, false, false)
  })

  it('should recalculate table height in case of changing forceRerenderProps', () => {
    jest.clearAllMocks()
    const setHeight = jest.spyOn(wrapper.instance(), 'setHeight')
    const forceRerenderProps = {}

    wrapper.setProps({
      ...defaultProps,
      forceRerenderProps,
    })

    expect(setHeight).toBeCalledTimes(1)
  })

  it('should attach wheel event listener on mount', () => {
    expect(mockAddEventListener).toHaveBeenCalledWith('wheel', wrapper.instance().onWheel)
  })

  it('should remove wheel event listener on unmount', () => {
    const onWheelHandler = wrapper.instance().onWheel

    wrapper.unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('wheel', onWheelHandler)
  })

  it('should propagate scroll to window when scrolling down at bottom boundary', () => {
    const mockScrollableElement = {
      scrollTop: 100,
      scrollHeight: 200,
      clientHeight: 100,
    }

    mockQuerySelector.mockReturnValueOnce(mockScrollableElement)

    const mockEvent = {
      deltaY: 50,
      stopPropagation: jest.fn(),
    }

    wrapper.instance().onWheel(mockEvent)

    expect(mockEvent.stopPropagation).toHaveBeenCalled()
    expect(mockScrollBy).nthCalledWith(1, {
      top: 50,
    })
  })

  it('should propagate scroll to window when scrolling up at top boundary', () => {
    const mockScrollableElement = {
      scrollTop: 0,
      scrollHeight: 200,
      clientHeight: 100,
    }

    mockQuerySelector.mockReturnValueOnce(mockScrollableElement)

    const mockEvent = {
      deltaY: -50,
      stopPropagation: jest.fn(),
    }

    wrapper.instance().onWheel(mockEvent)

    expect(mockEvent.stopPropagation).toHaveBeenCalled()
    expect(mockScrollBy).nthCalledWith(1, {
      top: -50,
    })
  })

  it('should not propagate scroll when scrolling down in the middle of content', () => {
    const mockScrollableElement = {
      scrollTop: 50,
      scrollHeight: 200,
      clientHeight: 100,
    }

    mockQuerySelector.mockReturnValueOnce(mockScrollableElement)

    const mockEvent = {
      deltaY: 50,
      stopPropagation: jest.fn(),
    }

    wrapper.instance().onWheel(mockEvent)

    expect(mockEvent.stopPropagation).not.toHaveBeenCalled()
    expect(mockScrollBy).not.toHaveBeenCalled()
  })

  it('should not propagate scroll when scrolling up in the middle of content', () => {
    const mockScrollableElement = {
      scrollTop: 50,
      scrollHeight: 200,
      clientHeight: 100,
    }

    mockQuerySelector.mockReturnValueOnce(mockScrollableElement)

    const mockEvent = {
      deltaY: -50,
      stopPropagation: jest.fn(),
    }

    wrapper.instance().onWheel(mockEvent)

    expect(mockEvent.stopPropagation).not.toHaveBeenCalled()
    expect(mockScrollBy).not.toHaveBeenCalled()
  })

  it('should not propagate scroll when scrollable element is not found', () => {
    mockQuerySelector.mockReturnValueOnce(null)

    const mockEvent = {
      deltaY: 50,
      stopPropagation: jest.fn(),
    }

    wrapper.instance().onWheel(mockEvent)

    expect(mockEvent.stopPropagation).not.toHaveBeenCalled()
    expect(mockScrollBy).not.toHaveBeenCalled()
  })

  it('should handle scroll at bottom boundary with tolerance', () => {
    const mockScrollableElement = {
      scrollTop: 99.5,
      scrollHeight: 200,
      clientHeight: 100,
    }

    mockQuerySelector.mockReturnValueOnce(mockScrollableElement)

    const mockEvent = {
      deltaY: 50,
      stopPropagation: jest.fn(),
    }

    wrapper.instance().onWheel(mockEvent)

    expect(mockEvent.stopPropagation).toHaveBeenCalled()
    expect(mockScrollBy).nthCalledWith(1, {
      top: 50,
    })
  })

  it('should handle scroll at top boundary with tolerance', () => {
    const mockScrollableElement = {
      scrollTop: 0.5,
      scrollHeight: 200,
      clientHeight: 100,
    }

    mockQuerySelector.mockReturnValueOnce(mockScrollableElement)

    const mockEvent = {
      deltaY: -50,
      stopPropagation: jest.fn(),
    }

    wrapper.instance().onWheel(mockEvent)

    expect(mockEvent.stopPropagation).toHaveBeenCalled()
    expect(mockScrollBy).nthCalledWith(1, {
      top: -50,
    })
  })
})
