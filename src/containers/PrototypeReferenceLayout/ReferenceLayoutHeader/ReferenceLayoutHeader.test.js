
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { Localization, localize } from '@/localization/i18n'
import { ReferenceLayout } from '@/models/ReferenceLayout'
import { render } from '@/utils/rendererRTL'
import { ReferenceLayoutViewType } from '../ReferenceLayoutViewType'
import { ReferenceLayoutHeader } from './ReferenceLayoutHeader'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('./LayoutsListDropdown', () => ({
  LayoutsListDropdown: () => <div data-testid='layouts-list-dropdown' />,
}))

const mockLayout = new ReferenceLayout({
  id: 'mockId1',
  blobName: 'mockBlobName1',
  prototypeId: 'mockPrototypeId',
  state: ReferenceLayoutState.PARSING,
  title: 'mockTitle1',
})

const mockFailedLayout = new ReferenceLayout({
  id: 'mockId2',
  blobName: 'mockBlobName2',
  prototypeId: 'mockPrototypeId',
  state: ReferenceLayoutState.FAILED,
  title: 'mockFailedLayout',
})

const mockLayoutsList = [mockLayout, mockFailedLayout]

test('show default title text in case there is no reference layout', () => {
  render(
    <ReferenceLayoutHeader
      addLayout={jest.fn()}
      isEditMode={true}
      onViewChange={jest.fn()}
      removeLayout={jest.fn()}
      viewType={ReferenceLayoutViewType.DOCUMENT}
    />,
  )

  const title = screen.getByRole('heading', { level: 4 })

  expect(title).toHaveTextContent(localize(Localization.REFERENCE_LAYOUTS))
})

test('show layout title in case there is a reference layout', () => {
  render(
    <ReferenceLayoutHeader
      addLayout={jest.fn()}
      isEditMode={true}
      layout={mockLayout}
      layoutsList={mockLayoutsList}
      onViewChange={jest.fn()}
      removeLayout={jest.fn()}
      viewType={ReferenceLayoutViewType.DOCUMENT}
    />,
  )

  const title = screen.getByRole('heading', { level: 4 })

  expect(title).toHaveTextContent(mockLayout.title)
})

test('show radio buttons for view type switch in case there is a reference layout', async () => {
  const onViewChangeMock = jest.fn()
  render(
    <ReferenceLayoutHeader
      addLayout={jest.fn()}
      isEditMode={true}
      layout={mockLayout}
      layoutsList={mockLayoutsList}
      onViewChange={onViewChangeMock}
      removeLayout={jest.fn()}
      viewType={ReferenceLayoutViewType.DOCUMENT}
    />,
  )

  const radioButtonDocumentView = screen.getByDisplayValue(ReferenceLayoutViewType.DOCUMENT)
  const radioButtonFieldListView = screen.getByDisplayValue(ReferenceLayoutViewType.FIELD_LIST)

  expect(radioButtonDocumentView.checked).toEqual(true)
  expect(radioButtonFieldListView.checked).toEqual(false)
})

test('does not show Add reference layout button in case prototype is not in edit mode', () => {
  render(
    <ReferenceLayoutHeader
      addLayout={jest.fn()}
      isEditMode={false}
      layout={mockLayout}
      layoutsList={mockLayoutsList}
      onViewChange={jest.fn()}
      removeLayout={jest.fn()}
      viewType={ReferenceLayoutViewType.DOCUMENT}
    />,
  )

  expect(screen.queryByText(localize(Localization.ADD_REFERENCE_LAYOUT))).not.toBeInTheDocument()
})

test('show dropdown menu with list of reference layouts', async () => {
  render(
    <ReferenceLayoutHeader
      addLayout={jest.fn()}
      isEditMode={true}
      layout={mockLayout}
      layoutsList={mockLayoutsList}
      onViewChange={jest.fn()}
      removeLayout={jest.fn()}
      viewType={ReferenceLayoutViewType.DOCUMENT}
    />,
  )

  expect(screen.getByTestId('layouts-list-dropdown')).toBeInTheDocument()
})
