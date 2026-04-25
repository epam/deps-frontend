
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ExtractionType } from '@/enums/ExtractionType'
import { DocumentType } from '@/models/DocumentType'
import { isDocumentTypeFetchingSelector } from '@/selectors/requests'
import { TemplateNavHeader } from '.'

const mockTemplateId = 'testId'

jest.mock('react', () => mockReact())
jest.mock('@/selectors/requests')
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    templateId: mockTemplateId,
  })),
}))

jest.mock('@/selectors/documentType', () => ({
  documentTypeStateSelector: jest.fn(() => mockTemplate),
}))

const mockTemplate = new DocumentType('type1', 'Template name', 'engine1', undefined, ExtractionType.TEMPLATE)

describe('Container: TemplateNavHeader', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      getTemplateVersions: jest.fn(),
    }

    wrapper = shallow(<TemplateNavHeader {...defaultProps} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Header extra content correctly', () => {
    expect(wrapper.props().renderExtra()).toMatchSnapshot()
  })

  it('should call isDocumentTypeFetchingSelector', () => {
    expect(isDocumentTypeFetchingSelector).toHaveBeenCalledTimes(1)
  })
})
