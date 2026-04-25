
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { NotificationModal } from './NotificationModal'

jest.mock('@/utils/env', () => mockEnv)

test('renders NotificationModal component correctly', () => {
  const props = {
    setIsVisible: jest.fn(),
  }

  render(<NotificationModal {...props} />)

  const modal = screen.getByRole('dialog')
  const title = screen.getByText(localize(Localization.SPLITTING))
  const content = screen.getByText(localize(Localization.SPLITTING_IN_PROGRESS))

  expect(modal).toBeInTheDocument()
  expect(title).toBeInTheDocument()
  expect(content).toBeInTheDocument()
})

test('calls setIsVisible when click on close btn', async () => {
  const props = {
    setIsVisible: jest.fn(),
  }

  render(<NotificationModal {...props} />)

  const closeBtn = screen.getByRole('button')
  await userEvent.click(closeBtn)

  expect(props.setIsVisible).nthCalledWith(1, false)
})
