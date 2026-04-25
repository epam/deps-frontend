
import { mockEnv } from '@/mocks/mockEnv'
import { localize, Localization } from '@/localization/i18n'
import { saveToFile, readFile } from '@/utils/file'
import {
  importEnvSettings,
  exportEnvSettings,
} from './exportEnvService'

const mockValidEnvConfig = {
  FEATURE_PDF_VIEWER: true,
}

const mockInValidEnvConfig = {
  NEVER_SEEN_ENF_NAME: true,
}

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/file', () => ({
  saveToFile: jest.fn(),
  readFile: jest.fn(async () => JSON.stringify(mockValidEnvConfig)),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('importEnvSettings calls readFile util with correct accept arg and provide expected value', async () => {
  const envSetting = await importEnvSettings()
  expect(readFile).toHaveBeenCalledTimes(1)
  expect(readFile).nthCalledWith(1, '@/application/json')
  expect(envSetting).toEqual(mockValidEnvConfig)
})

test('importEnvSettings throws error in case not valid data from the file', async () => {
  readFile.mockImplementationOnce(async () => JSON.stringify(mockInValidEnvConfig))
  await expect(importEnvSettings()).rejects.toThrow(
    localize(Localization.EXPORT_SERVICE_ENV_SETTINGS_ERROR),
  )
})

test('exportEnvSettings calls saveToFile util with correct args', () => {
  const fileName = 'envSettings'
  exportEnvSettings(mockValidEnvConfig, fileName)
  expect(saveToFile).toHaveBeenCalledTimes(1)
  expect(saveToFile).nthCalledWith(1, fileName, 'UTF-8', JSON.stringify(mockValidEnvConfig))
})

test('exportEnvSettings throws error in case not valid data as an argument', () => {
  const fileName = 'envSettings'
  try {
    exportEnvSettings(mockInValidEnvConfig, fileName)
  } catch (error) {
    expect(error.message).toBe(localize(Localization.EXPORT_SERVICE_ENV_SETTINGS_ERROR))
  }
})
