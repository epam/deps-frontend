
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { fetchUnifiedDataCells } from '@/actions/documents'
import {
  documentSelector,
  highlightedFieldSelector,
} from '@/selectors/documentReviewPage'
import { DocumentTableViewer } from './DocumentTableViewer'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('@/actions/documents', () => ({
  fetchUnifiedDataCells: jest.fn(),
}))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/env', () => mockEnv)

describe('Container: DocumentTableViewer', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      document: {
        ...documentSelector.getSelectorMockValue(),
        unifiedData: {
          3: [
            {
              id: 'cac68f22e4cd433982b3816ea7ac0d60',
              page: 1,
              maxRow: 2,
              maxColumn: 2,
              columns: [
                {
                  x: 0,
                },
                {
                  x: 0.5,
                },
              ],
              rows: [
                {
                  y: 0,
                },
                {
                  y: 0.2,
                },
              ],
              cells: [
                {
                  value: {
                    content: '1',
                    confidence: 1,
                  },
                  coordinates: {
                    column: 0,
                    row: 0,
                    colspan: 1,
                    rowspan: 1,
                  },
                },
                {
                  value: {
                    content: '2',
                    confidence: 1,
                  },
                  coordinates: {
                    column: 1,
                    row: 0,
                    colspan: 1,
                    rowspan: 1,
                  },
                },
                {
                  value: {
                    content: '3',
                    confidence: 1,
                  },
                  coordinates: {
                    column: 0,
                    row: 1,
                    colspan: 1,
                    rowspan: 1,
                  },
                },
                {
                  value: {
                    content: '4',
                    confidence: 1,
                  },
                  coordinates: {
                    column: 1,
                    row: 1,
                    colspan: 1,
                    rowspan: 1,
                  },
                },
              ],
              coordinates: null,
              name: 'Sheet1',
            },
          ],
        },
      },
      highlightedField: highlightedFieldSelector.getSelectorMockValue(),
      activePage: 3,
      activeSourceId: 'cac68f22e4cd433982b3816ea7ac0d60',
      renderPageSwitcher: jest.fn(),
    }

    wrapper = shallow(<DocumentTableViewer {...defaultProps} />)
  })

  it('should render DocumentTableViewer with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call fetchUnifiedDataCells once with correct arguments in case there is no cells', () => {
    defaultProps.document.unifiedData[3][0].cells = null

    wrapper.setProps(defaultProps)

    expect(fetchUnifiedDataCells).toHaveBeenCalledTimes(1)
    expect(fetchUnifiedDataCells).nthCalledWith(
      1,
      {
        documentId: defaultProps.document._id,
        tableConfigs: [{
          tableId: defaultProps.document.unifiedData[3][0].id,
          maxRow: defaultProps.document.unifiedData[3][0].maxRow,
          maxColumn: defaultProps.document.unifiedData[3][0].maxColumn,
        }],
      },
    )
  })
})
