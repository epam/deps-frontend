
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { documentsApi } from '@/api/documentsApi'
import { DocumentsStatesChart } from '.'

const mockResponse = {
  meta: {
    total: 12,
  },
}

jest.mock('react', () => mockReact())
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    getDocuments: jest.fn(() => Promise.resolve(mockResponse)),
  },
}))

jest.mock('@nivo/pie', () => mockComponent('ResponsivePie'))

describe('Container: DocumentsStatesChart', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DocumentsStatesChart />)
  })

  it('should render correct layout with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call documentsApi.getDocuments when render the component', () => {
    jest.clearAllMocks()

    wrapper = shallow(<DocumentsStatesChart />)

    expect(documentsApi.getDocuments).toHaveBeenCalledTimes(5)
  })
})
