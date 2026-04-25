
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { ConversationSettings } from './ConversationSettings'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/FeatureControl', () => ({
  FeatureControl: ({ children }) => children,
}))

jest.mock('../ChatContext', () => ({
  ChatContext: ({ disabled }) => (
    <button
      data-testid={'chat-context'}
      disabled={disabled}
    />
  ),
}))

jest.mock('../LLMSettingsButton', () => ({
  LLMSettingsButton: ({ disabled }) => (
    <button
      data-testid={'llm-settings'}
      disabled={disabled}
    />
  ),
}))

jest.mock('../PageSettingsButton', () => ({
  PageSettingsButton: ({ disabled }) => (
    <button
      data-testid={'page-settings'}
      disabled={disabled}
    />
  ),
}))

test('renders settings buttons', () => {
  render(
    <ConversationSettings
      disabled={false}
    />,
  )

  expect(screen.getByTestId('chat-context')).toBeInTheDocument()
  expect(screen.getByTestId('llm-settings')).toBeInTheDocument()
  expect(screen.getByTestId('page-settings')).toBeInTheDocument()
})

test('disables settings buttons if prop disable is true', () => {
  render(
    <ConversationSettings
      disabled={true}
    />,
  )

  expect(screen.getByTestId('chat-context')).toBeDisabled()
  expect(screen.getByTestId('llm-settings')).toBeDisabled()
  expect(screen.getByTestId('page-settings')).toBeDisabled()
})
