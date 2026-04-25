
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { RegionAreaPicker } from './RegionAreaPicker'

jest.mock('@/utils/image', () => ({
  loadImageURL: () => Promise.resolve({
    width: 100,
    height: 150,
  }),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Container: RegionAreaPicker', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      renderPageSwitcher: jest.fn(),
      title: 'MOCK_TITLE',
      message: 'MOCK_MESSAGE',
      fetching: false,
      imageUrl: 'mock/imgpath',
      onCancel: jest.fn(),
      onOk: jest.fn(),
    }

    wrapper = shallow(<RegionAreaPicker {...defaultProps} />)
  })

  it('should render layout correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
