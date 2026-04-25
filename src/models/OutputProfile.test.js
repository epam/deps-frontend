
import { mockEnv } from '@/mocks/mockEnv'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { OutputProfileType } from '@/enums/OutputProfileType'
import { DocumentLayoutSchema, ExtractedDataSchema, OutputProfile, ExportingType } from './OutputProfile'

jest.mock('@/utils/env', () => mockEnv)

const mockExtractedDataSchema = new ExtractedDataSchema({
  fields: [],
  needsValidationResults: false,
})

const mockDocumentLayoutSchema = new DocumentLayoutSchema({
  features: [],
  parsingType: 'tesseract',
})

const mockUserProfile = new OutputProfile({
  id: 'user-profile-id',
  name: 'User Profile',
  creationDate: '2024-01-01',
  version: '1.0.0',
  schema: mockExtractedDataSchema,
  format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
  exportingType: ExportingType.BUILT_IN,
})

const mockPluginProfile = new OutputProfile({
  id: 'plugin-profile-id',
  name: 'Plugin Profile',
  creationDate: '2024-01-01',
  version: '1.0.0',
  format: 'custom-format',
  exportingType: ExportingType.PLUGIN,
})

test('should return true for plugin profiles', () => {
  expect(OutputProfile.isPlugin(mockPluginProfile)).toBe(true)
})

test('should return false for user profiles', () => {
  expect(OutputProfile.isPlugin(mockUserProfile)).toBe(false)
})

test('should return BY_EXTRACTOR for profiles with fields schema', () => {
  const result = OutputProfile.getOutputProfileTypeBySchema(mockUserProfile)
  expect(result).toBe(OutputProfileType.BY_EXTRACTOR)
})

test('should return BY_LAYOUT for profiles with layout schema', () => {
  const profileWithLayout = new OutputProfile({
    id: 'layout-profile-id',
    name: 'Layout Profile',
    creationDate: '2024-01-01',
    version: '1.0.0',
    schema: mockDocumentLayoutSchema,
    format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
    exportingType: ExportingType.BUILT_IN,
  })

  const result = OutputProfile.getOutputProfileTypeBySchema(profileWithLayout)
  expect(result).toBe(OutputProfileType.BY_LAYOUT)
})
