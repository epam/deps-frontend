
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { Localization, localize } from '@/localization/i18n'
import { ReferenceLayout } from '@/models/ReferenceLayout'
import { render } from '@/utils/rendererRTL'
import { ReferenceLayoutGuard } from './ReferenceLayoutGuard'

jest.mock('@/utils/env', () => mockEnv)

const mockPrototypeId = 'mockPrototypeId'

const mockLayoutInProcessingState = new ReferenceLayout({
  id: 'mockId',
  prototypeId: mockPrototypeId,
  blobName: 'mockBlobName',
  state: ReferenceLayoutState.PARSING,
  title: 'mockTitle',
  unifiedData: {
    1: [{
      blobName: 'mockBlobName',
      id: 'mockId',
      page: 1,
    }],
  },
})

const mockLayoutInReadyState = {
  ...mockLayoutInProcessingState,
  state: ReferenceLayoutState.READY,
}

const mockLayoutInFailedState = {
  ...mockLayoutInProcessingState,
  state: ReferenceLayoutState.FAILED,
}

test('shows spinner if layout data is fetching and there is no reference layout', () => {
  render(
    <ReferenceLayoutGuard
      addLayout={jest.fn()}
      isFetching={true}
      prototypeId={mockPrototypeId}
      restartLayout={jest.fn()}
    >
      <div data-testid={'children'} />
    </ReferenceLayoutGuard>,
  )

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows empty layout view if there is no reference layout', async () => {
  render(
    <ReferenceLayoutGuard
      addLayout={jest.fn()}
      isFetching={false}
      prototypeId={mockPrototypeId}
      restartLayout={jest.fn()}
    >
      <div data-testid={'children'} />
    </ReferenceLayoutGuard>,
  )

  const emptyLayoutTitle = await screen.findByRole('heading', {
    level: 3,
    name: localize(Localization.EMPTY_SECTION_DISCLAIMER),
  })

  expect(emptyLayoutTitle).toBeInTheDocument()
})

test('shows failed layout view and triggers restartLayout on button click', async () => {
  const mockRestartLayout = jest.fn()

  render(
    <ReferenceLayoutGuard
      addLayout={jest.fn()}
      isFetching={false}
      prototypeId={mockPrototypeId}
      referenceLayout={mockLayoutInFailedState}
      restartLayout={mockRestartLayout}
    >
      <div data-testid={'children'} />
    </ReferenceLayoutGuard>,
  )

  const failedLayoutTitle = await screen.findByRole('heading', {
    level: 3,
    name: localize(Localization.REFERENCE_LAYOUT_FAILED),
  })

  expect(failedLayoutTitle).toBeInTheDocument()

  const button = screen.getByRole('button', { name: localize(Localization.RELOAD) })
  await userEvent.click(button)

  expect(mockRestartLayout).toHaveBeenCalledTimes(1)
})

test('shows processing layout view if reference layout is in processing', async () => {
  render(
    <ReferenceLayoutGuard
      addLayout={jest.fn()}
      isFetching={false}
      prototypeId={mockPrototypeId}
      referenceLayout={mockLayoutInProcessingState}
      restartLayout={jest.fn()}
    >
      <div data-testid={'children'} />
    </ReferenceLayoutGuard>,
  )

  const processingLayoutTitle = await screen.findByRole('heading', {
    level: 3,
    name: localize(Localization.REFERENCE_LAYOUT_PROCESSING),
  })

  expect(processingLayoutTitle).toBeInTheDocument()
})

test('returns children if layout is in ready state', async () => {
  render(
    <ReferenceLayoutGuard
      addLayout={jest.fn()}
      isFetching={false}
      prototypeId={mockPrototypeId}
      referenceLayout={mockLayoutInReadyState}
      restartLayout={jest.fn()}
    >
      <div data-testid={'children'} />
    </ReferenceLayoutGuard>,
  )

  expect(screen.getByTestId('children')).toBeInTheDocument()
})
