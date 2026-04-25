
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Expander } from '@/components/Expander'
import { DocumentsFilterConfig } from '@/models/DocumentsFilterConfig'
import { EmailAttachments } from './EmailAttachments'

const mockFilters = new DocumentsFilterConfig()

jest.mock('@/containers/DocumentsTable', () => mockComponent('DocumentsTable'))

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/documentsListPage', () => ({
  fetchDocumentsByFilter: jest.fn(),
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (f) => f(),
}))

const { ConnectedComponent } = EmailAttachments

describe('Component: EmailAttachments', () => {
  let wrapper
  let expander
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      documentId: '1',
      total: 10,
      filters: mockFilters,
      columnsData: [],
      fetchDocumentsByFilter: jest.fn(),
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    expander = shallow(
      <div>
        {wrapper.find(Expander).props().children(false, jest.fn())}
      </div>,
    )
  })

  it('should render EmailAttachments correctly in case Expander is not collapsed', () => {
    expect(wrapper).toMatchSnapshot()
    expect(expander).toMatchSnapshot()
  })

  it('should render EmailAttachments correctly in case Expander is collapsed', () => {
    expander = shallow(
      <div>
        {wrapper.find(Expander).props().children(true, jest.fn())}
      </div>,
    )
    expect(expander).toMatchSnapshot()
  })

  it('should load attachments when mount', () => {
    expect(defaultProps.fetchDocumentsByFilter).nthCalledWith(
      1, {
        ...mockFilters,
        parentId: defaultProps.documentId,
      },
    )
  })

  it('should render Empty in case filters and attachments are not present', () => {
    defaultProps = {
      ...defaultProps,
      total: 0,
      filters: {},
    }
    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    expander = shallow(
      <div>
        {wrapper.find(Expander).props().children(false, jest.fn())}
      </div>,
    )
    expect(expander).toMatchSnapshot()
  })
})
