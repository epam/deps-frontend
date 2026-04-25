
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { createProfileOutput } from '@/api/outputProfilesApi'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { OutputState } from '@/enums/OutputState'
import { Output } from '@/models/Output'
import {
  ExtractedDataSchema,
  OutputProfile,
  ExportingType,
} from '@/models/OutputProfile'
import { OutputNotification } from '../OutputNotification'
import { OutputCard } from './OutputCard'
import { ValidationSwitch } from './OutputCard.styles'

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
  name: 'Profile name',
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

jest.mock('@/api/outputProfilesApi', () => ({
  createProfileOutput: jest.fn(),
}))

describe('Component: OutputCard', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      output: mockOutput,
      profile: mockProfile,
      documentId: 'id',
      documentTitle: 'Document Title',
      documentTypeId: 'typeId',
      reloadData: jest.fn(),
    }

    wrapper = shallow(<OutputCard {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should nor render ValidationSwitch if no profile is provided', () => {
    defaultProps.profile = null

    wrapper.setProps(defaultProps)

    expect(wrapper.find(ValidationSwitch).exists()).toBe(false)
  })

  it('should not render ValidationSwitch if profile schema is null', () => {
    defaultProps.profile = new OutputProfile({
      id: 'id',
      name: 'Profile name',
      creationDate: '12-12-2000',
      version: '1.0.0',
      schema: null,
      format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
      exportingType: ExportingType.BUILT_IN,
    })

    wrapper.setProps(defaultProps)

    expect(wrapper.find(ValidationSwitch).exists()).toBe(false)
  })

  it('should not render OutputNotification if output in ready state', () => {
    defaultProps.output.state = OutputState.READY

    wrapper.setProps(defaultProps)

    expect(wrapper.find(OutputNotification).exists()).toBe(false)
  })

  it('should call createProfileOutput if click on OutputNotification button', async () => {
    defaultProps.profile = new OutputProfile({
      id: 'id',
      name: 'Profile name',
      creationDate: '12-12-2000',
      version: '1.1.1',
      schema: new ExtractedDataSchema({
        fields: [],
        needsValidationResults: false,
      }),
      format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
      exportingType: ExportingType.BUILT_IN,
    })

    const { documentId, documentTypeId, profile } = defaultProps

    wrapper.setProps(defaultProps)

    await wrapper.find(OutputNotification).props().onClick()

    expect(createProfileOutput).nthCalledWith(1, {
      documentId,
      documentTypeId,
      profileId: profile.id,
    })
  })

  it('should call regenerateData if click on OutputNotification button', async () => {
    defaultProps.profile = new OutputProfile({
      id: 'id',
      name: 'Profile name',
      creationDate: '12-12-2000',
      version: '1.1.1',
      schema: new ExtractedDataSchema({
        fields: [],
        needsValidationResults: false,
      }),
      format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
      exportingType: ExportingType.BUILT_IN,
    })

    wrapper.setProps(defaultProps)

    await wrapper.find(OutputNotification).props().onClick()

    expect(defaultProps.reloadData).toHaveBeenCalled()
  })
})
