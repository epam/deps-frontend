
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Slate } from '@/containers/Slate'
import { SLATE_ELEMENT_TYPE } from './models'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: Slate', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    const slateValue = {
      id: 'id',
      type: SLATE_ELEMENT_TYPE.PARAGRAPH,
      children: [{
        text: 'word',
        charRange: {
          begin: 0,
          end: 3,
        },
      }],
    }
    defaultProps = {
      value: [slateValue],
    }

    wrapper = shallow(<Slate {...defaultProps} />)
  })
  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
