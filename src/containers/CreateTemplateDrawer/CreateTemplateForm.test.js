
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useWatch } from 'react-hook-form'
import { ExtractionType } from '@/enums/ExtractionType'
import {
  Localization,
  localize,
} from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { ENV } from '@/utils/env'
import { CreateTemplateForm } from './CreateTemplateForm'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useWatch: jest.fn(() => null),
}))

jest.mock('@/selectors/engines')
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/selectors/documentTypes', () => ({
  documentTypesStateSelector: jest.fn(() => mockDocumentTypes),
}))

const template = new DocumentType('type1', 'Template name', 'engine1', undefined, ExtractionType.TEMPLATE)
const mockDocumentTypes = { type1: template }

describe('Component: CreateTemplateForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<CreateTemplateForm />)
  })

  it('should render CreateTemplateForm with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render Auto Markup option, if FEATURE_AUTO_LABELING is disabled', () => {
    ENV.FEATURE_AUTO_LABELING = false
    wrapper = shallow(<CreateTemplateForm />)

    expect(wrapper.find({
      label: localize(Localization.MARKUP_AUTOMATICALLY).toUpperCase(),
    })).toHaveLength(0)
  })

  it('should not disable Duplicate Fields and Auto Markup options by default', () => {
    ENV.FEATURE_AUTO_LABELING = true

    useWatch.mockImplementation(() => false)

    wrapper = shallow(<CreateTemplateForm />)

    const autoLabelingCheckbox = wrapper.find({
      label: localize(Localization.MARKUP_AUTOMATICALLY),
    })
    const duplicateFieldsSelect = wrapper.find({
      label: localize(Localization.DUPLICATE_FIELDS),
    })

    expect(autoLabelingCheckbox.props().field.disabled).toEqual(false)
    expect(duplicateFieldsSelect.props().field.disabled).toEqual(false)
  })

  it('should disable Auto Markup option, if Duplicate Fields is selected', () => {
    useWatch
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true)

    wrapper = shallow(<CreateTemplateForm />)

    const autoLabelingCheckbox = wrapper.find({
      label: localize(Localization.MARKUP_AUTOMATICALLY),
    })

    expect(autoLabelingCheckbox.props().field.disabled).toEqual(true)
  })

  it('should disable Duplicate Fields option, if Auto Markup is checked', () => {
    useWatch
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => null)

    wrapper = shallow(<CreateTemplateForm />)

    const duplicateFieldsSelect = wrapper.find({
      label: localize(Localization.DUPLICATE_FIELDS),
    })

    expect(duplicateFieldsSelect.props().field.disabled).toEqual(true)
  })
})
