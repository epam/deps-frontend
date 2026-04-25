
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { UI_ENV_SETTINGS } from '@/constants/storage'
import { Localization, localize } from '@/localization/i18n'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import {
  importEnvSettings,
  exportEnvSettings,
} from './exportEnvService'
import { ExportImportEnvSettings } from './ExportImportEnvSettings'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/localStorageWrapper', () => ({
  localStorageWrapper: {
    getItem: jest.fn(() => 'mockEnvSettings'),
    setItem: jest.fn(),
  },
}))
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('./exportEnvService', () => ({
  importEnvSettings: jest.fn(async () => 'mockEnvSettings'),
  exportEnvSettings: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

delete window.location
window.location = {
  reload: jest.fn(),
}

test('import button click executes import Env service functionality', async () => {
  render(<ExportImportEnvSettings />)

  const importButton = screen.getByTestId('import-env-settings')
  await userEvent.click(importButton)
  expect(importEnvSettings).toHaveBeenCalled()
})

test('import button click executes local storage set value with correct values', async () => {
  render(<ExportImportEnvSettings />)

  const importButton = screen.getByTestId('import-env-settings')
  await userEvent.click(importButton)
  expect(localStorageWrapper.setItem).nthCalledWith(1, UI_ENV_SETTINGS, 'mockEnvSettings')
})

test('import button click executes reload of the window', async () => {
  render(<ExportImportEnvSettings />)

  const importButton = screen.getByTestId('import-env-settings')
  await userEvent.click(importButton)
  expect(window.location.reload).toHaveBeenCalled()
})

test('export button click executes local storage get value with correct values', async () => {
  render(<ExportImportEnvSettings />)

  const exportButton = screen.getByTestId('export-env-settings')
  expect(exportButton).not.toBeDisabled()

  await userEvent.click(exportButton)
  expect(localStorageWrapper.getItem).nthCalledWith(1, UI_ENV_SETTINGS)
})

test('export button click executes export Env service functionality', async () => {
  render(<ExportImportEnvSettings />)

  const exportButton = screen.getByTestId('export-env-settings')
  await userEvent.click(exportButton)
  expect(exportEnvSettings).nthCalledWith(1, 'mockEnvSettings', expect.stringMatching(/ui_env_settings_.*\.json/))
})

test('export button should be disabled in case there are no saved settings', () => {
  localStorageWrapper.getItem.mockReturnValueOnce(null)
  render(<ExportImportEnvSettings />)

  const exportButton = screen.getByTestId('export-env-settings')
  expect(exportButton).toBeDisabled()
})

test('import button click doesn`t execute local storage set and reload of the window', async () => {
  importEnvSettings.mockReturnValueOnce(null)
  render(<ExportImportEnvSettings />)

  const importButton = screen.getByTestId('import-env-settings')
  await userEvent.click(importButton)
  expect(localStorageWrapper.setItem).not.toHaveBeenCalled()
  expect(window.location.reload).not.toHaveBeenCalled()
})

test('import button click executes notification warning in case import service error', async () => {
  importEnvSettings.mockImplementationOnce(() => {
    throw new Error('mock error')
  })
  render(<ExportImportEnvSettings />)

  const importButton = screen.getByTestId('import-env-settings')
  await userEvent.click(importButton)
  expect(notifyWarning).nthCalledWith(1, localize(Localization.EXPORT_SERVICE_ENV_SETTINGS_ERROR))
})

test('export button click executes notification warning in case export service error', async () => {
  exportEnvSettings.mockImplementationOnce(() => {
    throw new Error('mock error')
  })
  render(<ExportImportEnvSettings />)

  const exportButton = screen.getByTestId('export-env-settings')
  await userEvent.click(exportButton)
  expect(notifyWarning).nthCalledWith(1, localize(Localization.EXPORT_SERVICE_ENV_SETTINGS_ERROR))
})
