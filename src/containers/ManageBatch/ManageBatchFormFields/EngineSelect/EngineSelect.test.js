
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { fetchOCREngines } from '@/actions/engines'
import { ocrEnginesSelector } from '@/selectors/engines'
import { render } from '@/utils/rendererRTL'
import { EngineSelect } from './EngineSelect'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/requests')
jest.mock('@/selectors/engines')

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/engines', () => ({
  fetchOCREngines: jest.fn(),
}))

const mockDispatch = jest.fn()

test('should render select with options', () => {
  render(
    <EngineSelect
      fetching={false}
      onChange={jest.fn()}
    />,
  )

  expect(screen.getByTestId('CustomSelect')).toBeInTheDocument()
})

test('calls fetchOCREngines when select is rendered if engines are empty', () => {
  ocrEnginesSelector.mockReturnValueOnce([])

  render(
    <EngineSelect
      fetching={false}
      onChange={jest.fn()}
    />,
  )

  expect(mockDispatch).toHaveBeenCalledWith(fetchOCREngines())
})
