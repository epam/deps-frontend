
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { TemplateLabelingToolPage } from '.'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({
    templateId: 'mockTemplateId',
    versionId: 'mockVersionId',
  })),
}))

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/services/FileCache', () => ({
  FileCache: {
    save: jest.fn(),
    get: jest.fn(),
  },
}))

describe('Component: TemplateLabelingToolPage ', () => {
  it('should render correct layout', () => {
    const wrapper = shallow(<TemplateLabelingToolPage />)

    expect(wrapper).toMatchSnapshot()
  })
})
