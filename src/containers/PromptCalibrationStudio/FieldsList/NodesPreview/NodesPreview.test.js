
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { NodesPreview } from './NodesPreview'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/AIMicrochipIcon', () => mockComponent('AIMicrochipIcon'))
jest.mock('@/components/Icons/SitemapIcon', () => mockComponent('SitemapIcon'))
jest.mock('@/components/Icons/ErrorTriangleIcon', () => mockComponent('ErrorTriangleIcon'))

const mockNode1 = new QueryNode({
  id: '1',
  name: 'Prompt 1',
  prompt: 'Single prompt text',
})

const mockNode2 = new QueryNode({
  id: '2',
  name: 'Prompt 2',
  prompt: 'Second prompt',
})

const props = {
  nodes: [mockNode1],
}

test('renders single prompt button with tooltip', async () => {
  render(<NodesPreview {...props} />)

  const microchipIcon = screen.getByText('AIMicrochipIcon')

  await userEvent.hover(microchipIcon)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(mockNode1.prompt)
  })
})

test('renders multi-prompt button with tooltip', async () => {
  const props = {
    nodes: [mockNode1, mockNode2],
  }

  render(<NodesPreview {...props} />)

  const sitemapIcon = screen.getByText('SitemapIcon')
  await userEvent.hover(sitemapIcon)

  const tooltip = await screen.findByRole('tooltip')

  expect(tooltip).toHaveTextContent(`1. ${mockNode1.name}`)
  expect(tooltip).toHaveTextContent(mockNode1.prompt)
  expect(tooltip).toHaveTextContent(`2. ${mockNode2.name}`)
  expect(tooltip).toHaveTextContent(mockNode2.prompt)
})

test('renders warning triangle icon when there are no nodes', async () => {
  const props = {
    nodes: [],
  }

  render(<NodesPreview {...props} />)

  const warningTriangleIcon = screen.getByText('ErrorTriangleIcon')
  await userEvent.hover(warningTriangleIcon)

  const tooltip = await screen.findByRole('tooltip')

  expect(tooltip).toHaveTextContent(localize(Localization.GEN_AI_FIELD_WITHOUT_PROMPTS_MESSAGE))
})
