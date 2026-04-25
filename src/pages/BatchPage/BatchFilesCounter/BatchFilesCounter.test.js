
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, render } from '@testing-library/react'
import { BatchFilesCounter } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./BatchFilesCounter.styles', () => ({
  ...mockShallowComponent('Counter'),
  ...mockShallowComponent('TotalText'),
  ...mockShallowComponent('Wrapper'),
}))

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({
    id: '123',
  })),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useFetchBatchQuery: jest.fn(() => ({
    data: {
      files: [{}],
    },
  })),
}))

test('renders Counter with correct count of files', () => {
  render(<BatchFilesCounter />)
  const Counter = screen.getByTestId('Counter')

  expect(Counter).toHaveTextContent('1')
})

test('renders Counter with correct text', () => {
  render(<BatchFilesCounter />)
  const TotalText = screen.getByTestId('TotalText')

  expect(TotalText).toHaveTextContent('FILES TOTAL')
})
