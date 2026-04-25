
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { Footer } from './Footer'

jest.mock('@/utils/env', () => mockEnv)

test('renders Footer component correctly', () => {
  const props = {
    onClear: jest.fn(),
    onCancel: jest.fn(),
    onSave: jest.fn(),
    isSaveDisabled: false,
  }

  render(<Footer {...props} />)

  const clearBtn = screen.getByRole('button', { name: localize(Localization.RESET) })
  const saveBtn = screen.getByRole('button', { name: localize(Localization.SAVE) })
  const cancelBtn = screen.getByRole('button', { name: localize(Localization.CANCEL) })

  expect(clearBtn).toBeInTheDocument()
  expect(saveBtn).toBeInTheDocument()
  expect(cancelBtn).toBeInTheDocument()
})

test('do not render cancel btn when onCancel is not provided', () => {
  const props = {
    onClear: jest.fn(),
    onSave: jest.fn(),
    isSaveDisabled: false,
  }

  render(<Footer {...props} />)

  const cancelBtn = screen.queryByRole('button', { name: localize(Localization.CANCEL) })

  expect(cancelBtn).not.toBeInTheDocument()
})

test('do not render save btn when onSave is not provided', () => {
  const props = {
    onClear: jest.fn(),
    onCancel: jest.fn(),
    isSaveDisabled: false,
  }

  render(<Footer {...props} />)

  const saveBtn = screen.queryByRole('button', { name: localize(Localization.SAVE) })

  expect(saveBtn).not.toBeInTheDocument()
})

test('calls onClear when click on clear btn', async () => {
  const props = {
    onClear: jest.fn(),
    onCancel: jest.fn(),
    onSave: jest.fn(),
    isSaveDisabled: false,
  }

  render(<Footer {...props} />)

  const clearBtn = screen.getByRole('button', { name: localize(Localization.RESET) })
  await userEvent.click(clearBtn)

  expect(props.onClear).toHaveBeenCalled()
})

test('calls onSave when click on save btn', async () => {
  const props = {
    onClear: jest.fn(),
    onCancel: jest.fn(),
    onSave: jest.fn(),
    isSaveDisabled: false,
  }

  render(<Footer {...props} />)

  const saveBtn = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.click(saveBtn)

  expect(props.onSave).toHaveBeenCalled()
})

test('calls onCancel when click on cancel btn', async () => {
  const props = {
    onClear: jest.fn(),
    onCancel: jest.fn(),
    onSave: jest.fn(),
    isSaveDisabled: false,
  }

  render(<Footer {...props} />)

  const cancelBtn = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  await userEvent.click(cancelBtn)

  expect(props.onCancel).toHaveBeenCalled()
})

test('does not call onSave when click on save btn if save btn is disabled', async () => {
  jest.clearAllMocks()

  const props = {
    onClear: jest.fn(),
    onCancel: jest.fn(),
    onSave: jest.fn(),
    isSaveDisabled: true,
  }

  render(<Footer {...props} />)

  const saveBtn = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.click(saveBtn)

  expect(props.onSave).not.toHaveBeenCalled()
})
