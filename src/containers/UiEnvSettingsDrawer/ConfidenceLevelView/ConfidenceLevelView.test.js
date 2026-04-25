
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { ConfidenceLevelView as ConfidenceLevelViewEnum } from '@/enums/ConfidenceLevel'
import { render } from '@/utils/rendererRTL'
import { ConfidenceLevelView } from './ConfidenceLevelView'

jest.mock('@/utils/env', () => mockEnv)

const props = {
  envCode: 'MOCK_ENV_CODE',
  value: ConfidenceLevelViewEnum.AS_ICONS,
  onChange: jest.fn(),
}

test('calls props onChange when button is clicked', async () => {
  render(<ConfidenceLevelView {...props} />)

  for (const view of Object.values(ConfidenceLevelViewEnum)) {
    const button = screen.getByTestId(view)
    await userEvent.click(button)
    expect(props.onChange).toHaveBeenCalledWith(props.envCode, view)
  }
  expect(props.onChange).toHaveBeenCalledTimes(Object.values(ConfidenceLevelViewEnum).length)
})
