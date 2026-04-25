
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { DocumentColumn } from '@/containers/DocumentsTable/columns/DocumentColumn'
import { TableColumnsPicker } from './TableColumnsPicker'

const { ConnectedComponent } = TableColumnsPicker
const mockUpdateDocumentTitle = 'mockUpdateDocumentTitle'

jest.mock('@/actions/documentReviewPage', () => ({
  updateDocument: jest.fn(() => mockUpdateDocumentTitle),
}))

jest.mock('@/selectors/documentReviewPage')

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

describe('Component: TableColumnsPicker', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      saveTableColumns: jest.fn(),
      columns: [DocumentColumn.DATE, DocumentColumn.LABELS, DocumentColumn.TITLE],
      children: [
        <div key="1">Column</div>,
      ],
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render TableColumnsPicker with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render dropdown menu with column checkboxes', () => {
    const dropdownMenu = shallow(<div>{wrapper.find('Dropdown').props().dropdownRender()}</div>)
    expect(dropdownMenu).toMatchSnapshot()
  })
})
