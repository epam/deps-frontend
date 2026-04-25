
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import React from 'react'
import { fetchDocumentOutputs } from '@/api/outputProfilesApi'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { OutputState } from '@/enums/OutputState'
import { Localization, localize } from '@/localization/i18n'
import { Output } from '@/models/Output'
import { OutputProfile, ExtractedDataSchema, ExportingType } from '@/models/OutputProfile'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import { DocumentOutputArchiveButton } from './DocumentOutputArchiveButton'
import { NoData } from './DocumentOutputArchiveButton.styles'

const mockOutput = new Output({
  id: 'id',
  tenantId: 'tenantId',
  creationDate: '12-12-2012',
  profileInfo: {
    id: 'id',
    version: '1.0.0',
  },
  documentId: 'documentId',
  state: OutputState.PENDING,
  filePath: 'filepath.json',
})

const mockProfile = new OutputProfile({
  id: 'id',
  name: 'name',
  creationDate: '12-12-2000',
  version: '1.0.0',
  schema: new ExtractedDataSchema({
    fields: [],
    needsValidationResults: false,
  }),
  format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
  exportingType: ExportingType.BUILT_IN,
})

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/api/outputProfilesApi', () => ({
  fetchDocumentOutputs: jest.fn(() => Promise.resolve({})),
}))

const defaultDocumentType = documentTypeSelector.getSelectorMockValue()
documentTypeSelector.mockImplementation(() => ({
  ...defaultDocumentType,
  profiles: [mockProfile],
}))

describe('Container: DocumentOutputArchiveButton', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(React, 'useState').mockImplementationOnce(
      () => [true, jest.fn()],
    )
  })

  it('should render DocumentOutputArchiveButton', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(
      () => [[mockOutput], jest.fn()],
    )

    jest.spyOn(React, 'useState').mockImplementationOnce(
      () => [false, jest.fn()],
    )

    wrapper = shallow(<DocumentOutputArchiveButton />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should call fetchDocumentOutputs when render component', async () => {
    wrapper = shallow(<DocumentOutputArchiveButton />)

    expect(fetchDocumentOutputs).nthCalledWith(
      1,
      documentSelector.getSelectorMockValue()._id,
    )
  })

  it('should call notifyWarning if fetchDocumentOutputs request fails', async () => {
    fetchDocumentOutputs.mockImplementationOnce(() => Promise.reject(new Error('test')))

    wrapper = shallow(<DocumentOutputArchiveButton />)

    await flushPromises()

    expect(mockNotification.notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })

  it('should render NoData if there no outputs for current document', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], jest.fn()])
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()])

    wrapper = shallow(<DocumentOutputArchiveButton />)

    expect(wrapper.find(NoData).exists()).toBe(true)
  })
})
