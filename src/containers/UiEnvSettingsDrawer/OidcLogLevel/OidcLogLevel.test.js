
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { OidcLogLevel } from './OidcLogLevel'

jest.mock('@/utils/env', () => mockEnv)

const props = {
  envCode: 'MOCK_ENV_CODE',
  value: 1,
  onChange: jest.fn(),
}

test('calls props onChange when button is clicked', async () => {
  render(<OidcLogLevel {...props} />)

  const buttons = screen.getAllByRole('button')

  for (const [index, button] of Object.entries(buttons)) {
    await userEvent.click(button)
    expect(props.onChange).toHaveBeenCalledWith(props.envCode, +index)
  }
})
