
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import {
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { deleteOutputProfile } from '@/api/outputProfilesApi'
import { FileExtension, FILE_EXTENSION_TO_DOWNLOAD_FORMAT } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { ExtractedDataSchema, OutputProfile, ExportingType } from '@/models/OutputProfile'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DeleteOutputProfileButton } from './DeleteOutputProfileButton'

const mockIconContent = 'DeleteIcon'
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/Icons/DeleteIconFilled', () => ({
  DeleteIconFilled: () => mockIconContent,
}))
jest.mock('@/api/outputProfilesApi', () => ({
  deleteOutputProfile: jest.fn(() => Promise.resolve({})),
}))
jest.mock('@/utils/notification', () => mockNotification)

const mockDocumentTypeId = 'mockDocTypeId'

const mockProfile = new OutputProfile({
  id: 'mockProfileId',
  name: 'Mock Profile',
  format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
  creationDate: '2024-01-01',
  version: '1.0.0',
  schema: new ExtractedDataSchema({
    fields: [],
    needsValidationResults: false,
  }),
  exportingType: ExportingType.BUILT_IN,
})

const mockPluginProfile = new OutputProfile({
  id: 'mockPluginProfileId',
  name: 'Mock Plugin Profile',
  format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
  creationDate: '2024-01-01',
  version: '1.0.0',
  schema: new ExtractedDataSchema({
    fields: [],
    needsValidationResults: false,
  }),
  exportingType: ExportingType.PLUGIN,
})

test('show action button', () => {
  render(
    <DeleteOutputProfileButton
      documentTypeId={mockDocumentTypeId}
      isDeletionAllowed={false}
      onAfterDelete={jest.fn()}
      profile={mockProfile}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockIconContent,
  })

  expect(button).toBeInTheDocument()
})

test('show correct tooltip message if deletion is not allowed and user hovers the button', async () => {
  render(
    <DeleteOutputProfileButton
      documentTypeId={mockDocumentTypeId}
      isDeletionAllowed={false}
      onAfterDelete={jest.fn()}
      profile={mockProfile}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockIconContent,
  })

  fireEvent.mouseOver(button)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.OUTPUT_PROFILE_DELETION_IS_NOT_ALLOWED))
  })
})

test('show correct tooltip message when user hovers the button and deletion is allowed', async () => {
  render(
    <DeleteOutputProfileButton
      documentTypeId={mockDocumentTypeId}
      isDeletionAllowed={true}
      onAfterDelete={jest.fn()}
      profile={mockProfile}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockIconContent,
  })

  fireEvent.mouseOver(button)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.DELETE_PROFILE))
  })
})

test('show correct tooltip message for plugin profile', async () => {
  render(
    <DeleteOutputProfileButton
      documentTypeId={mockDocumentTypeId}
      isDeletionAllowed={true}
      onAfterDelete={jest.fn()}
      profile={mockPluginProfile}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockIconContent,
  })

  fireEvent.mouseOver(button)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.OUTPUT_PROFILE_DELETION_IS_NOT_ALLOWED_PLUGINS))
  })
})

test('call deleteOutputProfile api in case of button click', async () => {
  render(
    <DeleteOutputProfileButton
      documentTypeId={mockDocumentTypeId}
      isDeletionAllowed={true}
      onAfterDelete={jest.fn()}
      profile={mockProfile}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockIconContent,
  })

  await userEvent.click(button)

  expect(deleteOutputProfile).nthCalledWith(
    1,
    mockDocumentTypeId,
    mockProfile.id,
  )
})

test('call notifySuccess and refreshTable prop in case deletion was successful', async () => {
  const mockOnAfterDelete = jest.fn()

  render(
    <DeleteOutputProfileButton
      documentTypeId={mockDocumentTypeId}
      isDeletionAllowed={true}
      onAfterDelete={mockOnAfterDelete}
      profile={mockProfile}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockIconContent,
  })

  await userEvent.click(button)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.OUTPUT_PROFILE_DELETE_SUCCESS_STATUS),
  )
  expect(mockOnAfterDelete).toHaveBeenCalledTimes(1)
})

test('call notifyWarning in case deletion has failed', async () => {
  deleteOutputProfile.mockImplementation(() => Promise.reject(new Error('')))

  render(
    <DeleteOutputProfileButton
      documentTypeId={mockDocumentTypeId}
      isDeletionAllowed={true}
      onAfterDelete={jest.fn()}
      profile={mockProfile}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockIconContent,
  })

  await userEvent.click(button)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('disable button for plugin profile', () => {
  render(
    <DeleteOutputProfileButton
      documentTypeId={mockDocumentTypeId}
      isDeletionAllowed={true}
      onAfterDelete={jest.fn()}
      profile={mockPluginProfile}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockIconContent,
  })

  expect(button).toBeDisabled()
})
