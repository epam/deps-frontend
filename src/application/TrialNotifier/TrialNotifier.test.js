
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockDayjs } from '@/mocks/mockDayjs'
import { mockEnv } from '@/mocks/mockEnv'
import { mockLocalStorageWrapper } from '@/mocks/mockLocalStorageWrapper'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import dayjs from 'dayjs'
import { shallow } from 'enzyme'
import { TRIAL_NOTIFICATION_LAST_SHOWN_DATE } from '@/constants/storage'
import { getDatesDifference } from '@/utils/dayjs'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { TrialNotifier } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('dayjs', () => mockDayjs('2023-07-21'))
jest.mock('@/utils/dayjs', () => ({
  ...jest.requireActual('@/utils/dayjs'),
  getStartOfDay: jest.fn(() => '2023-07-21T00:00:00.000Z'),
  getDatesDifference: jest.fn(),
}))
jest.mock('@/utils/localStorageWrapper', () => mockLocalStorageWrapper())
jest.mock('@/containers/TrialDrawer', () => mockComponent('TrialDrawer'))
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/trial', () => ({
  trialExpirationDateSelector: jest.fn(() => '2023-07-20'),
}))

describe('Component: TrialNotifier', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TrialNotifier />)
    jest.clearAllMocks()
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call localStorage.getItem first time with key TRIAL_NOTIFICATION_LAST_SHOWN_DATE', () => {
    shallow(<TrialNotifier />)
    expect(localStorageWrapper.getItem).nthCalledWith(1, TRIAL_NOTIFICATION_LAST_SHOWN_DATE)
  })

  it('should not call localStorage.setItem if it not less than 5 days till trial ends', () => {
    getDatesDifference.mockImplementation(() => 7)
    shallow(<TrialNotifier />)

    expect(localStorageWrapper.setItem).not.toHaveBeenCalled()
  })

  it('should not call localStorage.setItem if trial is ended', () => {
    getDatesDifference.mockImplementation(() => -2)
    shallow(<TrialNotifier />)

    expect(localStorageWrapper.setItem).not.toHaveBeenCalled()
  })

  it('should call localStorage.setItem if trial ends in less then five days', () => {
    getDatesDifference.mockImplementation(() => 3)
    shallow(<TrialNotifier />)

    expect(localStorageWrapper.setItem).toHaveBeenCalled()
  })

  it('should not call localStorage.setItem if user was notified today', () => {
    getDatesDifference.mockImplementation(() => 2)

    localStorageWrapper.getItem.mockImplementation(() => ({
      [TRIAL_NOTIFICATION_LAST_SHOWN_DATE]: dayjs().toString(),
    }))
    shallow(<TrialNotifier />)

    expect(localStorageWrapper.setItem).not.toHaveBeenCalled()
  })
})
