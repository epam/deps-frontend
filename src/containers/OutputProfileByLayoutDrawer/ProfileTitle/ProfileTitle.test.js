
import { mockEnv } from '@/mocks/mockEnv'
import { fireEvent, screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ProfileTitle } from './ProfileTitle'

jest.mock('@/utils/env', () => mockEnv)

const mockTitle = 'Profile Name'
const INPUT_MAX_LENGTH = 50

test('show Profile Title input with correct label', () => {
  render(
    <ProfileTitle
      isProfileNameValid={true}
      profileName={mockTitle}
      setIsProfileNameValid={jest.fn()}
      updateProfile={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.NAME))).toBeInTheDocument()
})

test('show passed title as input value', () => {
  render(
    <ProfileTitle
      isProfileNameValid={true}
      profileName={mockTitle}
      setIsProfileNameValid={jest.fn()}
      updateProfile={jest.fn()}
    />,
  )

  const input = screen.getByRole('textbox')

  expect(input.value).toEqual(mockTitle)
})

test('call updateProfile if profile name was changed ', async () => {
  const mockUpdateProfile = jest.fn()

  render(
    <ProfileTitle
      isProfileNameValid={true}
      profileName={mockTitle}
      setIsProfileNameValid={jest.fn()}
      updateProfile={mockUpdateProfile}
    />,
  )

  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'New title' } })

  expect(mockUpdateProfile).nthCalledWith(
    1,
    expect.any(Function),
  )
})

test('call setIsProfileNameValid if profile name was changed ', async () => {
  const mockSetIsProfileNameValid = jest.fn()

  render(
    <ProfileTitle
      isProfileNameValid={true}
      profileName={mockTitle}
      setIsProfileNameValid={mockSetIsProfileNameValid}
      updateProfile={jest.fn()}
    />,
  )

  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'New title' } })

  expect(mockSetIsProfileNameValid).nthCalledWith(1, true)
})

test('show correct error message if profile name is empty', async () => {
  render(
    <ProfileTitle
      isProfileNameValid={false}
      profileName={''}
      setIsProfileNameValid={jest.fn()}
      updateProfile={jest.fn()}
    />,
  )

  const input = screen.getByRole('textbox')
  input.focus()
  input.blur()

  expect(screen.getByText(localize(Localization.REQUIRED_VALIDATOR_ERROR_MESSAGE))).toBeInTheDocument()
})

test('show correct error message if profile name exceeds max symbols ', async () => {
  const invalidName = 'a'.repeat(INPUT_MAX_LENGTH + 1)
  const errorMessage = localize(Localization.MAXIMUM_SYMBOLS_ERROR, {
    maximumSymbols: INPUT_MAX_LENGTH,
  })

  render(
    <ProfileTitle
      isProfileNameValid={false}
      profileName={invalidName}
      setIsProfileNameValid={jest.fn()}
      updateProfile={jest.fn()}
    />,
  )

  const input = screen.getByRole('textbox')
  input.focus()
  input.blur()

  expect(screen.getByText(errorMessage)).toBeInTheDocument()
})
