
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import ShallowRenderer from 'react-test-renderer/shallow'
import { clearKeyToAssign, storeKeyToAssign } from '@/actions/prototypePage'
import { Localization, localize } from '@/localization/i18n'
import { KeyValuePairElementLayout, KeyValuePairLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { theme } from '@/theme/theme.default'
import { KeyValuePairsViewer } from './KeyValuePairsViewer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('../Canvas/Canvas', () => mockComponent('Canvas'))
jest.mock('@/actions/prototypePage', () => ({
  storeKeyToAssign: jest.fn(),
  clearKeyToAssign: jest.fn(),
}))

const mockKeyValuePairs = [
  new KeyValuePairLayout({
    key: new KeyValuePairElementLayout(
      'keyContent',
      [
        new Point(0.111, 0.222),
        new Point(0.333, 0.444),
      ],
    ),
    value: new KeyValuePairElementLayout(
      'valueContent',
      [
        new Point(0.731, 0.456),
        new Point(0.123, 0.234),
      ],
    ),
    confidence: 0,
    id: 'mockId',
  }),
]

const mockScaleFactor = 1
const mockImageUrl = 'mockImageUrl'

test('show correct layout', async () => {
  const renderer = new ShallowRenderer()

  const wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={false}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  expect(wrapper).toMatchSnapshot()
})

test('show correct k-v border color if key is unassigned', async () => {
  const renderer = new ShallowRenderer()

  const wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={false}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const [line] = wrapper.props.lines

  expect(line.stroke).toBe(theme.color.orange)
})

test('show correct k-v border color if key is assigned', async () => {
  const renderer = new ShallowRenderer()

  const checkIsKeyAssigned = jest.fn(() => true)

  const wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={checkIsKeyAssigned}
      imageUrl={mockImageUrl}
      isEditMode={false}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const [line] = wrapper.props.lines

  expect(line.stroke).toBe(theme.color.greenBright)
})

test('show correct k-v border color if it is edit mode and user clicked on k-v pair', async () => {
  const renderer = new ShallowRenderer()
  let wrapper

  wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={true}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const [line] = wrapper.props.lines

  await line.onClick({ cancelBubble: false })

  wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={true}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const [selectedShape] = wrapper.props.lines

  expect(selectedShape.stroke).toBe(theme.color.primary2)
})

test('call storeKeyToAssign with correct key value if it is edit mode and user clicked on k-v pair', async () => {
  const renderer = new ShallowRenderer()
  const wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={true}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const [line] = wrapper.props.lines

  await line.onClick({ cancelBubble: false })

  const [kv] = mockKeyValuePairs

  expect(storeKeyToAssign).nthCalledWith(1, kv.key.content)
})

test('k-v lines are not clickable if edit mode is not enabled', async () => {
  const renderer = new ShallowRenderer()
  const wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={false}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const [line] = wrapper.props.lines

  expect(line.onClick).toBeUndefined()
})

test('draw connection line between key and value', async () => {
  const renderer = new ShallowRenderer()
  const wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={false}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const connectionLine = wrapper.props.lines.find((l) => !l.closed)

  expect(connectionLine).toBeDefined()
})

test('draws tooltip correctly when onMouseEnter prop is called on polygon', async () => {
  jest.useFakeTimers()
  let wrapper

  const renderer = new ShallowRenderer()
  wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={true}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const [line] = wrapper.props.lines

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

  await line.onMouseEnter(mockEvent)

  jest.advanceTimersByTime(400)

  wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={true}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  const tooltip = wrapper.props.renderExtra()

  expect(tooltip.props.title).toBe(localize(Localization.SELECT_KEY_VALUE_TO_ASSIGN_TOOLTIP))
  expect(tooltip.props.open).toBe(true)

  jest.useRealTimers()
})

test('clears key to assign on stage click', async () => {
  const renderer = new ShallowRenderer()
  const wrapper = renderer.render(
    <KeyValuePairsViewer
      checkIsKeyAssigned={jest.fn()}
      imageUrl={mockImageUrl}
      isEditMode={false}
      keyValuePairs={mockKeyValuePairs}
      onScaleChange={jest.fn()}
      scaleFactor={mockScaleFactor}
    />,
  )

  wrapper.props.onStageClick()

  expect(clearKeyToAssign).toHaveBeenCalled()
})
