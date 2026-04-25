
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DOCUMENT_LAYOUT_FEATURE } from '@/enums/DocumentLayoutType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { LayoutFeatures } from './LayoutFeatures'

jest.mock('@/utils/env', () => mockEnv)

const mockFeature = DOCUMENT_LAYOUT_FEATURE.KEY_VALUE_PAIRS
const mockFeatures = [mockFeature]

test('show layouts features with correct title', () => {
  render(
    <LayoutFeatures
      features={mockFeatures}
      updateProfile={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.LAYOUTS))).toBeInTheDocument()
})

test('show all predefined layouts features', () => {
  render(
    <LayoutFeatures
      features={mockFeatures}
      updateProfile={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.KEY_VALUE_PAIRS))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.TABLES))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.TEXT))).toBeInTheDocument()
})

test('show passed layouts features as checked', () => {
  render(
    <LayoutFeatures
      features={mockFeatures}
      updateProfile={jest.fn()}
    />,
  )

  const switcher = within(screen.getByTestId(`switcher-${mockFeatures}`))
  const button = switcher.getByRole('switch')

  expect(button).toBeChecked()
})

test('call updateProfile if switcher was clicked ', async () => {
  const mockUpdateProfile = jest.fn()

  render(
    <LayoutFeatures
      features={mockFeatures}
      updateProfile={mockUpdateProfile}
    />,
  )

  const switcher = within(screen.getByTestId(`switcher-${mockFeatures}`))
  const button = switcher.getByRole('switch')

  await userEvent.click(button)

  expect(mockUpdateProfile).nthCalledWith(
    1,
    expect.any(Function),
  )
})
