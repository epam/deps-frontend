
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { render } from '@/utils/rendererRTL'
import { HiddenEngines } from './HiddenEngines'

var mockSelect

jest.mock('@/components/Select', () => {
  const { SelectMode, SelectOption } = jest.requireActual('@/components/Select')
  const mock = mockShallowComponent('CustomSelect')
  mockSelect = mock.CustomSelect
  return {
    ...mock,
    SelectMode,
    SelectOption,
  }
})

jest.mock('@/utils/env', () => mockEnv)

const props = {
  envCode: 'MOCK_ENV_CODE',
  value: ['test'],
  onChange: jest.fn(),
}

test('calls props onChange when select is changed', () => {
  render(<HiddenEngines {...props} />)

  const selectProps = mockSelect.getProps()
  selectProps.onChange(['gcp'])

  expect(props.onChange).toHaveBeenCalledTimes(1)
  expect(props.onChange).nthCalledWith(1, props.envCode, ['gcp'])
})
