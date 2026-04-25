
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import ShallowRenderer from 'react-test-renderer/shallow'
import { render } from '@/utils/rendererRTL'
import { StatisticCard } from './StatisticCard'

jest.mock('@/utils/env', () => mockEnv)

const defaultProps = {
  title: 'Mock Title',
  currentValue: 1,
  totalValue: 10,
}

test('StatisticCard component has correct layout', () => {
  const renderer = new ShallowRenderer()
  const wrapper = renderer.render(<StatisticCard {...defaultProps} />)
  expect(wrapper).toMatchSnapshot()
})

test('extra is displaying correctly if renderExtra is passed as prop', () => {
  const mockButtonText = 'mock text'
  const props = {
    ...defaultProps,
    renderExtra: () => (
      <button>{mockButtonText}</button>
    ),
  }

  render(<StatisticCard {...props} />)
  const regexp = new RegExp(mockButtonText, 'i')
  expect(screen.getByRole('button', regexp)).toBeInTheDocument()
})
