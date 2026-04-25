
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { CustomCollapse } from './CustomCollapse'

jest.mock('@/utils/env', () => mockEnv)

const Panel = CustomCollapse.Panel
const panelHeader1 = 'Panel1'
const panelHeader2 = 'Panel2'
const panelContent1 = 'Content1'
const panelContent2 = 'Content2'

const renderExpandButton = (panelProps, onClick) => (
  <button
    data-testid={`expand-btn-${panelProps.panelKey}`}
    onClick={onClick}
  />
)

const renderPanels = () => [
  <Panel
    key='key1'
    header={panelHeader1}
  >
    {panelContent1}
  </Panel>,
  <Panel
    key='key2'
    header={panelHeader2}
  >
    {panelContent2}
  </Panel>,
]

test('renders panels headers', () => {
  render(
    <CustomCollapse
      renderExpandButton={renderExpandButton}
      renderPanels={renderPanels}
    />,
  )
  expect(screen.getByText(panelHeader1)).toBeInTheDocument()
  expect(screen.getByText(panelHeader2)).toBeInTheDocument()
})

test('toggles panel content on expand button click', async () => {
  render(
    <CustomCollapse
      renderExpandButton={renderExpandButton}
      renderPanels={renderPanels}
    />,
  )

  expect(screen.queryByText(panelContent1)).not.toBeInTheDocument()
  expect(screen.queryByText(panelContent2)).not.toBeInTheDocument()

  await userEvent.click(screen.getByTestId('expand-btn-key1'))
  expect(screen.getByText(panelContent1)).toBeInTheDocument()

  await userEvent.click(screen.getByTestId('expand-btn-key1'))
  expect(screen.queryByText(panelContent1)).not.toBeInTheDocument()
})
