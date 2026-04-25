
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { act } from 'react-dom/test-utils'
import { Localization, localize } from '@/localization/i18n'
import { TableCellLayout, TableLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { theme } from '@/theme/theme.default'
import { render } from '@/utils/rendererRTL'
import { CanvasLine, CanvasScaleConfig } from '../Canvas'
import { TablesViewer } from './TablesViewer'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../Canvas/Canvas', () => mockShallowComponent('Canvas'))

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => fn),
)

const mockCell = new TableCellLayout({
  content: 'Cell content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTable = new TableLayout({
  id: 'id1',
  order: 1,
  cells: [mockCell],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockScaleFactor = 1
const mockImageUrl = 'mockImageUrl'
let MockCanvas

beforeAll(() => {
  MockCanvas = require('../Canvas/Canvas').Canvas
})

beforeAll(() => {
  jest.clearAllMocks()
})

test('renders correct layout', () => {
  render(
    <TablesViewer
      imageUrl={mockImageUrl}
      isEditMode={false}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
      tables={[mockTable]}
    />,
  )

  expect(MockCanvas.getProps()).toEqual(expect.objectContaining({
    imageUrl: mockImageUrl,
    lines: expect.arrayContaining([
      expect.any(CanvasLine),
    ]),
    onStageClick: expect.any(Function),
    renderExtra: expect.any(Function),
    scaleConfig: expect.any(CanvasScaleConfig),
  }))
})

test('shows correct table border color if table is unassigned', () => {
  render(
    <TablesViewer
      imageUrl={mockImageUrl}
      isEditMode={false}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
      tables={[mockTable]}
    />,
  )

  const [line] = MockCanvas.getProps().lines

  expect(line.stroke).toBe(theme.color.orange)
})

test('shows correct table border color if it is edit mode and user clicked on table', () => {
  render(
    <TablesViewer
      imageUrl={mockImageUrl}
      isEditMode={true}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
      tables={[mockTable]}
    />,
  )

  const [line] = MockCanvas.getProps().lines

  act(() => {
    line.onClick({ cancelBubble: false })
  })

  const [selectedShape] = MockCanvas.getProps().lines
  expect(selectedShape.stroke).toBe(theme.color.primary2)
})

test('draws tooltip correctly when onMouseEnter prop is called on polygon', () => {
  render(
    <TablesViewer
      imageUrl={mockImageUrl}
      isEditMode={true}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
      tables={[mockTable]}
    />,
  )

  const mockEvent = {
    target: {
      getStage: () => ({
        getPointerPosition: () => ({
          x: 0,
          y: 0,
        }),
        container: () => ({
          style: {},
        }),
      }),
    },
  }

  const [line] = MockCanvas.getProps().lines

  act(() => {
    line.onMouseEnter(mockEvent)
  })

  const tooltip = MockCanvas.getProps().renderExtra(false)

  expect(tooltip.props.title).toEqual(localize(Localization.SELECT_TABLE_TO_CREATE_NEW_FIELD))
})

test('unselects table if user clicks on stage', () => {
  render(
    <TablesViewer
      imageUrl={mockImageUrl}
      isEditMode={true}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
      tables={[mockTable]}
    />,
  )

  const [line] = MockCanvas.getProps().lines

  act(() => {
    line.onClick({ cancelBubble: false })
  })

  MockCanvas.getProps().onStageClick()

  const images = MockCanvas.getProps().images
  expect(images).toBeUndefined()

  const lines = MockCanvas.getProps().lines
  const colors = lines.map((l) => l.stroke)
  colors.forEach((c) => expect(c).toBe(theme.color.orange))
})

test('shows action image if it is edit mode and user selected table', () => {
  const mockTopRightX = 5
  const mockTopRightY = 1

  const mockTable = new TableLayout({
    id: 'id1',
    order: 1,
    cells: [mockCell],
    confidence: 0,
    columnCount: 1,
    rowCount: 1,
    polygon: [
      new Point(0, 0),
      new Point(mockTopRightX, mockTopRightY),
      new Point(3, 2),
      new Point(6, 3),
    ],
  })

  render(
    <TablesViewer
      imageUrl={mockImageUrl}
      isEditMode={true}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
      tables={[mockTable]}
    />,
  )

  MockCanvas.getProps().onStageClick()

  const [line] = MockCanvas.getProps().lines

  act(() => {
    line.onClick({ cancelBubble: false })
  })

  const [image] = MockCanvas.getProps().images

  expect(image).toBeDefined()
  expect(image.x).toBe(mockTopRightX)
  expect(image.y).toBe(mockTopRightY)
})
