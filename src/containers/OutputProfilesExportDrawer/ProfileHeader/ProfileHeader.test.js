
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Switch } from '@/components/Switch'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { ExtractedDataSchema, OutputProfile, ExportingType } from '@/models/OutputProfile'
import { ProfileHeader } from './ProfileHeader'
import { Label } from './ProfileHeader.styles'

const mockProfile = new OutputProfile({
  id: 'id',
  name: 'name',
  creationDate: '10-10-2001',
  version: '1.0.0',
  schema: new ExtractedDataSchema({
    fields: [],
    needsValidationResults: true,
  }),
  format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
  exportingType: ExportingType.BUILT_IN,
})

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ProfileHeader', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      profile: mockProfile,
    }

    wrapper = shallow(<ProfileHeader {...defaultProps} />)
  })

  it('should render ProfileHeader', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render validation switch with label if profileType is BY_EXTRACTOR', () => {
    wrapper.setProps({ profile: mockProfile })

    expect(wrapper.find(Label).text()).toBe(localize(Localization.VALIDATION_ERRORS))
    expect(wrapper.find(Switch).prop('checked')).toBe(mockProfile.schema.needsValidationResults)
    expect(wrapper.find(Switch).prop('disabled')).toBe(true)
  })
})
