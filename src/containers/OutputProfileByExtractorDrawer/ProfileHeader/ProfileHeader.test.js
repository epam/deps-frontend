
import { mockEnv } from '@/mocks/mockEnv'
import { fireEvent, screen } from '@testing-library/react'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ProfileHeader } from './ProfileHeader'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('../OutputFormat', () => ({
  OutputFormat: () => <div data-testid="output-format" />,
}))
jest.mock('../ProfileTitle', () => ({
  ProfileTitle: () => <div data-testid="profile-title" />,
}))

const mockTitle = 'Profile Name'
const mockFormat = FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON]

test('show Profile Header with Profile Name and Output Format sections', () => {
  render(
    <ProfileHeader
      needsValidationResults={true}
      profileFormat={mockFormat}
      profileName={mockTitle}
      setIsProfileNameValid={jest.fn()}
      updateProfile={jest.fn()}
    />,
  )

  expect(screen.getByTestId('profile-title')).toBeInTheDocument()
  expect(screen.getByTestId('output-format')).toBeInTheDocument()
})

test('show Validation errors switcher with correct label', () => {
  render(
    <ProfileHeader
      needsValidationResults={true}
      profileFormat={mockFormat}
      profileName={mockTitle}
      setIsProfileNameValid={jest.fn()}
      updateProfile={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.VALIDATION_ERRORS))).toBeInTheDocument()
})

test('show checked Validation errors switcher if needsValidationResults is on', () => {
  render(
    <ProfileHeader
      needsValidationResults={true}
      profileFormat={mockFormat}
      profileName={mockTitle}
      setIsProfileNameValid={jest.fn()}
      updateProfile={jest.fn()}
    />,
  )

  const switcher = screen.getByRole('switch')

  expect(switcher).toBeChecked()
})

test('call updateProfile if Validation errors switcher was changed ', async () => {
  const mockUpdateProfile = jest.fn()

  render(
    <ProfileHeader
      needsValidationResults={true}
      profileFormat={mockFormat}
      profileName={mockTitle}
      setIsProfileNameValid={jest.fn()}
      updateProfile={mockUpdateProfile}
    />,
  )

  const switcher = screen.getByRole('switch')
  fireEvent.click(switcher)

  expect(mockUpdateProfile).nthCalledWith(
    1,
    expect.any(Function),
  )
})
