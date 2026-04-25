
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import dayjs from 'dayjs'
import { shallow } from 'enzyme'
import React from 'react'
import { fetchTrialLimitationsInfo } from '@/actions/trial'
import { Spin } from '@/components/Spin'
import { Localization, localize } from '@/localization/i18n'
import { isTrialLimitationsInfoFetchingSelector } from '@/selectors/requests'
import { trialExpirationDateSelector } from '@/selectors/trial'
import { ENV } from '@/utils/env'
import { TrialDrawerButton } from './TrialDrawerButton'
import { DrawerOpenButton } from './TrialDrawerButton.styles'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('@/utils/env', () => mockEnv)
jest.mock('dayjs', () => ({
  __esModule: true,
  default: (() => {
    const dayjs = jest.fn(() => ({
      localeData: () => ({
        longDateFormat: jest.fn(),
      }),
      isValid: jest.fn(),
      diff: jest.fn(() => -1),
    }))
    dayjs.locale = () => {}

    dayjs.utc = jest.fn()

    return dayjs
  })(),

}))

jest.mock('@/actions/trial', () => ({
  fetchTrialLimitationsInfo: jest.fn(),
}))

jest.mock('@/selectors/trial')
jest.mock('@/selectors/requests')

describe('Container: TrialDrawerButton', () => {
  let wrapper

  beforeEach(() => {
    ENV.FEATURE_TRIAL_VERSION = true

    wrapper = shallow(<TrialDrawerButton />)
  })

  it('should show correct message if some days left for trial', () => {
    const mockDays = 5

    dayjs.mockImplementation(() => ({
      diff: jest.fn(() => mockDays),
    }))

    wrapper = shallow(<TrialDrawerButton />)

    expect(wrapper.find(DrawerOpenButton).text().includes(
      localize(Localization.TIME_LEFT, { time: mockDays + 1 }),
    )).toBe(true)
  })

  it('should call fetchTrialLimitationsInfo when render container the first time', () => {
    jest.clearAllMocks()

    wrapper = shallow(<TrialDrawerButton />)

    expect(fetchTrialLimitationsInfo).toHaveBeenCalled()
  })

  it('should set spinning to true if limitations are fetching', () => {
    isTrialLimitationsInfoFetchingSelector.mockImplementation(() => true)
    trialExpirationDateSelector.mockReturnValueOnce(null)

    wrapper = shallow(<TrialDrawerButton />)

    expect(wrapper.find(Spin).props().spinning).toBe(true)
  })
})
