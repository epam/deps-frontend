
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Spin } from '@/components/Spin'
import { navigationMap } from '@/utils/navigationMap'
import { openInNewTarget } from '@/utils/window'
import { Card } from '../Card'
import { TemplatesCard } from '.'

const mockDispatch = jest.fn((action) => action)

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/utils/window', () => ({
  openInNewTarget: jest.fn(),
}))

const defaultProps = {
  count: 1,
  isFetching: false,
}

describe('Container: TemplatesCard', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TemplatesCard {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Spin if templates are fetching', () => {
    wrapper = shallow(
      <TemplatesCard
        count={0}
        isFetching={true}
      />,
    )

    expect(wrapper.find(Spin).exists()).toEqual(true)
  })

  it('should call openInNewTarget function with correct arguments after click on the card', () => {
    const mockEvent = {
      target: {
        value: 'mockValue',
      },
    }

    const CardComponent = wrapper.find(Card)
    CardComponent.props().onClick(mockEvent)

    expect(openInNewTarget).nthCalledWith(
      1,
      mockEvent,
      navigationMap.documentTypes(),
      expect.any(Function),
    )
  })
})
