
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ExtractedDataSchema, OutputProfile } from '@/models/OutputProfile'
import { FieldsList } from './FieldsList'
import { OutputProfileByExtractor as Component } from '.'

jest.mock('@/utils/env', () => mockEnv)

const mockField = new DocumentTypeField(
  'code',
  'name',
  {},
  FieldType.ENUM,
  false,
  1,
  'code',
  'pk',
)

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
})

describe('Component: OutputProfile', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      isEditMode: false,
      fields: [mockField],
      profileFields: mockProfile.schema.fields,
      setProfileFields: jest.fn(),
    }

    wrapper = shallow(<Component {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should add field to profile in case of onFieldToggle call with fieldCode that is not in profile', () => {
    wrapper.find(FieldsList).props().onFieldToggle(mockField.code)

    expect(defaultProps.setProfileFields).nthCalledWith(1, [mockField.code])
  })

  it('should exclude field from profile in case of onFieldToggle call with fieldCode that is in profile', () => {
    wrapper.setProps({
      ...defaultProps,
      profileFields: [mockField.code],
    })

    wrapper.find(FieldsList).props().onFieldToggle(mockField.code)

    expect(defaultProps.setProfileFields).nthCalledWith(1, [])
  })

  it('should first display the fields that are in the profile', () => {
    const mockFieldCode = 'mockCode'
    const mockProfileField = {
      ...mockField,
      code: mockFieldCode,
    }
    wrapper.setProps({
      ...defaultProps,
      profileFields: [mockFieldCode],
      fields: [
        mockField,
        mockProfileField,
      ],
    })

    const { fields } = wrapper.find(FieldsList).props()

    expect(fields[0].isInProfile).toEqual(true)
  })
})
