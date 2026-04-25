
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Flag } from '@/components/Flag'
import { CommentsFlag } from './CommentsFlag'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: CommentsFlag', () => {
  let defaultProps, wrapper

  it('should render correct layout', () => {
    defaultProps = {
      comments: [
        {
          createdAt: 'createdAtMock1',
          createdBy: 'createdByMock1',
          text: 'textMock1',
        },
        {
          createdAt: 'createdAtMock2',
          createdBy: 'createdByMock2',
          text: 'textMock2',
        },
      ],
    }
    wrapper = shallow(<CommentsFlag {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should nor render CommentsFlag in case property is empty', () => {
    defaultProps = {}
    wrapper = shallow(<CommentsFlag {...defaultProps} />)
    expect(wrapper.find(Flag).exists()).toBe(false)
  })
})
