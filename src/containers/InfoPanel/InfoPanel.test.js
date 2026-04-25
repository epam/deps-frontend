
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { InfoPanel } from './InfoPanel'

jest.mock('@/utils/env', () => mockEnv)

test('show text label and total number', () => {
  const mockTotal = 10

  render(
    <InfoPanel
      fetching={false}
      total={mockTotal}
    />)

  expect(screen.getByText(localize(Localization.TOTAL_NUMBER))).toBeInTheDocument()
  expect(screen.getByText(mockTotal)).toBeInTheDocument()
})

test('show spinner instead of a total number in case fetching is true', () => {
  render(
    <InfoPanel
      fetching={true}
      total={0}
    />)

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('show actions in case renderActions function was passed', () => {
  const mockTotal = 10
  const mockButtonText = 'Action'
  const mockActions = <button>{mockButtonText}</button>

  render(
    <InfoPanel
      fetching={false}
      renderActions={() => mockActions}
      total={mockTotal}
    />)

  const button = screen.getByRole('button', { name: mockButtonText })

  expect(button).toBeInTheDocument()
})
