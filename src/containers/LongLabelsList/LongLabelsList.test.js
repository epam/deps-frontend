
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { removeLabel } from '@/actions/documents'
import { Localization, localize } from '@/localization/i18n'
import { Label } from '@/models/Label'
import { notifySuccess } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { LongLabelsList } from './LongLabelsList'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/documents', () => ({
  removeLabel: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/containers/LongTagsList', () => ({
  LongTagsList: jest.fn(({ tags, onTagClose }) => tags.map((t) => (
    <div key={t.id}>
      {t.text}
      <button onClick={() => onTagClose(t)} />
    </div>
  ))),
}))

const mockDocId = 'docId'
const mockLabels = [
  new Label('id1', 'Label name 1'),
  new Label('id2', 'Label name 2'),
]

test('shows labels correctly', () => {
  render(
    <LongLabelsList
      documentId={mockDocId}
      labels={mockLabels}
    />,
  )

  mockLabels.forEach((label) => expect(screen.getByText(label.name)).toBeInTheDocument())
})

test('calls removeLabel with correct arguments on remove icon click', async () => {
  render(
    <LongLabelsList
      documentId={mockDocId}
      labels={mockLabels}
    />,
  )

  const [closeButton] = screen.getAllByRole('button')
  await userEvent.click(closeButton)

  expect(removeLabel).nthCalledWith(
    1,
    mockLabels[0]._id,
    mockDocId,
  )
})

test('shows correct message on successful removing', async () => {
  render(
    <LongLabelsList
      documentId={mockDocId}
      labels={mockLabels}
    />,
  )

  const [closeButton] = screen.getAllByRole('button')
  await userEvent.click(closeButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.REMOVE_LABEL_SUCCESSFUL),
  )
})
