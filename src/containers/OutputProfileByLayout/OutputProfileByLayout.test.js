
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { DOCUMENT_LAYOUT_FEATURE } from '@/enums/DocumentLayoutType'
import { render } from '@/utils/rendererRTL'
import { OutputProfileByLayout } from './OutputProfileByLayout'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/OutputProfileFeatureSwitch', () => ({
  OutputProfileFeatureSwitch: () => <div data-testid="profile-feature" />,
}))

const features = [
  DOCUMENT_LAYOUT_FEATURE.KEY_VALUE_PAIRS,
  DOCUMENT_LAYOUT_FEATURE.TABLES,
  DOCUMENT_LAYOUT_FEATURE.TEXT,
]

test('should render the correct parsing feature text', () => {
  render(<OutputProfileByLayout features={features} />)
  expect(screen.getByText(/parsing features/i)).toBeInTheDocument()
})

test('should render correct amount of features', () => {
  render(<OutputProfileByLayout features={features} />)
  const renderedFeatures = screen.getAllByTestId('profile-feature')
  expect(renderedFeatures).toHaveLength(features.length)
})
