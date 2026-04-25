
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { ExtractedDataSchema, OutputProfile, ExportingType } from '@/models/OutputProfile'
import { OutputProfileFormatInfo } from './'

jest.mock('@/utils/env', () => mockEnv)

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

describe('Component: OutputProfileFormatInfo', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      profile: mockProfile,
    }

    wrapper = shallow(<OutputProfileFormatInfo {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
