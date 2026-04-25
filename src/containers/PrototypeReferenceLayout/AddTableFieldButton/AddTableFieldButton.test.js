
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toggleAddFieldDrawer } from '@/actions/prototypePage'
import { render } from '@/utils/rendererRTL'
import { AddTableFieldButton } from './AddTableFieldButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/prototypePage', () => ({
  toggleAddFieldDrawer: jest.fn(() => ({ type: 'mockType' })),
}))

test('renders button and call toggleAddFieldDrawer on user click', async () => {
  render(<AddTableFieldButton />)

  const button = screen.getByRole('button')
  await userEvent.click(button)

  expect(toggleAddFieldDrawer).toHaveBeenCalled()
})
