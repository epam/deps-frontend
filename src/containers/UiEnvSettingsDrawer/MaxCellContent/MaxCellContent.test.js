
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { render } from '@/utils/rendererRTL'
import { MaxCellContent } from './MaxCellContent'

var mockInputNumber

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./MaxCellContent.styles', () => {
  const mock = mockShallowComponent('InputNumber')
  mockInputNumber = mock.InputNumber
  return mock
})

const props = {
  envCode: 'MOCK_ENV_CODE',
  value: 10,
  onChange: jest.fn(),
}

test('calls props onChange when input is changed', () => {
  render(<MaxCellContent {...props} />)

  const inputProps = mockInputNumber.getProps()
  inputProps.onChange(20)

  expect(props.onChange).toHaveBeenCalledTimes(1)
  expect(props.onChange).nthCalledWith(1, props.envCode, 20)
})
