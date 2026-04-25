
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { Label } from '@/models/Label'
import { render } from '@/utils/rendererRTL'
import { AddLabelsPicker } from './AddLabelsPicker'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ManageLabelsModalButton', () => ({
  ManageLabelsModalButton: jest.fn(({ renderTrigger, onSubmit }) => (
    <button
      data-testid="manage-labels-btn"
      onClick={() => onSubmit(mockNewLabel)}
    >
      {renderTrigger()}
    </button>
  )),
}))

const mockNewLabel = new Label('id', 'name')

test('renders the select component', () => {
  const defaultProps = {
    onChange: jest.fn(),
    value: [],
  }

  render(<AddLabelsPicker {...defaultProps} />)

  expect(screen.getByRole('combobox')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.SELECT_LABEL))).toBeInTheDocument()
})

test('calls setValue with correct args when a user adds a label', async () => {
  const defaultProps = {
    onChange: jest.fn(),
    value: [],
  }

  render(<AddLabelsPicker {...defaultProps} />)

  await userEvent.click(screen.getByTestId('manage-labels-btn'))
  expect(defaultProps.onChange).nthCalledWith(1, [mockNewLabel])
})

test('calls setValue with correct args when a user remove a label', async () => {
  const defaultProps = {
    onChange: jest.fn(),
    value: [mockNewLabel],
  }

  render(<AddLabelsPicker {...defaultProps} />)

  const [labelTag] = screen.getAllByTestId('tag')
  const removeLabelButton = within(labelTag).getByTestId('close-icon')

  await userEvent.click(removeLabelButton)
  expect(defaultProps.onChange).nthCalledWith(1, [])
})

test('calls setValue with correct args when a user clears all labels', async () => {
  const defaultProps = {
    onChange: jest.fn(),
    value: [mockNewLabel],
  }

  render(<AddLabelsPicker {...defaultProps} />)

  await userEvent.click(screen.getByLabelText('close-circle'))
  expect(defaultProps.onChange).nthCalledWith(1, [])
})
