
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { DocumentLabelingToolPage } from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ documentId: 'mockID' })),
}))

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/services/FileCache', () => ({
  FileCache: {
    save: jest.fn(),
    get: jest.fn(),
  },
}))

describe('Component: DocumentLabelingToolPage ', () => {
  it('should render correct', () => {
    const wrapper = shallow(<DocumentLabelingToolPage />)

    expect(wrapper).toMatchSnapshot()
  })
})
