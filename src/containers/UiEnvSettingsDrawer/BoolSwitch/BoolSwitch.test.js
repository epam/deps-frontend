
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { render } from '@/utils/rendererRTL'
import { BoolSwitch } from './BoolSwitch'

jest.mock('@/utils/env', () => mockEnv)

const props = {
  envCode: 'MOCK_ENV_CODE',
  value: true,
  onChange: jest.fn(),
}

test('calls props onChange when switch is changed', () => {
  render(<BoolSwitch {...props} />)

  const switchElement = screen.getByRole('switch')
  switchElement.click()
  expect(props.onChange).toHaveBeenCalledTimes(1)
  expect(props.onChange).nthCalledWith(1, props.envCode, !props.value)
})
