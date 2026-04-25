
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Spin } from '@/components/Spin'
import { navigationMap } from '@/utils/navigationMap'
import { openInNewTarget } from '@/utils/window'
import { Card } from '../Card'
import { PrototypesCard } from '.'

const mockDispatch = jest.fn((action) => action)

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/utils/window', () => ({
  openInNewTarget: jest.fn(),
}))

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn((pathname, config) => ({
    pathname,
    config,
  })),
}))

const defaultProps = {
  count: 5,
  isFetching: false,
}

describe('Container: PrototypesCard', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<PrototypesCard {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Spin if users are fetching', () => {
    wrapper = shallow(
      <PrototypesCard
        count={0}
        isFetching={true}
      />,
    )

    expect(wrapper.find(Spin).props().spinning).toEqual(true)
  })

  it('should call openInNewTarget function with correct arguments after click on the card', () => {
    const mockEvent = {
      target: {
        value: 'mockValue',
      },
    }

    wrapper.find(Card).props().onClick(mockEvent)

    expect(openInNewTarget).nthCalledWith(
      1,
      mockEvent,
      navigationMap.documentTypes(),
      expect.any(Function),
    )
  })
})
