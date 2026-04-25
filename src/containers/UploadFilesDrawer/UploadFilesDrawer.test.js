
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FIELD_FORM_CODE } from './constants'
import { UploadFilesDrawer } from './UploadFilesDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('./hooks', () => ({
  useUploadFiles: jest.fn(() => ({
    uploadFiles: mockUploadFiles,
    areFilesUploading: false,
  })),
}))

jest.mock('./UploadFilesForm', () => mockShallowComponent('UploadFilesForm'))
jest.mock('./FileSettingsForm', () => mockShallowComponent('FileSettingsForm'))

useForm.mockImplementation(() => ({
  watch: jest.fn(() => mockFormValues),
  getValues: jest.fn(() => mockFormValues),
  reset: mockResetCallback,
}))

const mockUploadFiles = jest.fn(() => Promise.resolve([]))

const mockFormValues = {
  [FIELD_FORM_CODE.FILES]: [{
    name: 'file1.png',
    uid: 'uid1',
  }],
  [FIELD_FORM_CODE.ENGINE]: null,
  [FIELD_FORM_CODE.PARSING_FEATURES]: [KnownParsingFeature.TEXT],
  [FIELD_FORM_CODE.LABELS]: [],
}

const mockResetCallback = jest.fn()

test('uploads files with correct data when Upload btn is clicked', async () => {
  jest.clearAllMocks()

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<UploadFilesDrawer {...defaultProps} />)

  const triggerBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
  })

  await userEvent.click(triggerBtn)

  const saveBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
    exact: false,
  })

  await userEvent.click(saveBtn)

  expect(mockUploadFiles).nthCalledWith(1, mockFormValues)
})

test('disables Save button when no files are selected', async () => {
  useForm.mockImplementationOnce(() => ({
    watch: jest.fn(() => ({
      ...mockFormValues,
      files: [],
    })),
    getValues: jest.fn(() => ({
      ...mockFormValues,
      files: [],
    })),
  }))

  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<UploadFilesDrawer {...defaultProps} />)

  const saveBtn = screen.getByRole('button', {
    name: localize(Localization.UPLOAD),
    exact: false,
  })

  expect(saveBtn).toBeDisabled()
})

test('calls for reset when click on Reset All button', async () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
  }

  render(<UploadFilesDrawer {...defaultProps} />)

  const resetBtn = screen.getByRole('button', {
    name: localize(Localization.RESET_SETTINGS),
    exact: false,
  })

  await userEvent.click(resetBtn)

  expect(mockResetCallback).nthCalledWith(1, {
    ...mockFormValues,
    files: mockFormValues.files,
  })
})
