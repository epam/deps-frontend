
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useGetOrganisationUsersQuery } from '@/apiRTK/iamApi'
import { Spin } from '@/components/Spin'
import { PaginationKeys } from '@/constants/navigation'
import { BASE_ORG_USERS_FILTER_CONFIG } from '@/models/OrgUserFilterConfig'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import { openInNewTarget } from '@/utils/window'
import { Card } from '../Card'
import { UsersCard } from '.'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/authorization')

jest.mock('@/apiRTK/iamApi', () => ({
  useGetOrganisationUsersQuery: jest.fn(() => ({
    data: {
      meta: { total: 2 },
      result: [],
    },
    isLoading: false,
  })),
}))

jest.mock('@/utils/window', () => ({
  openInNewTarget: jest.fn(),
}))

describe('Container: UsersCard', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<UsersCard />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call userSelector on mount', () => {
    expect(userSelector).toHaveBeenCalled()
  })

  it('should call useGetOrganisationUsersQuery with correct args', () => {
    const mockUser = userSelector.getSelectorMockValue()
    const expectedArgs = {
      orgPk: mockUser.organisation.pk,
      filters: {
        ...BASE_ORG_USERS_FILTER_CONFIG,
        ...DefaultPaginationConfig,
        [PaginationKeys.PER_PAGE]: 1,
      },
    }

    expect(useGetOrganisationUsersQuery).nthCalledWith(1, expectedArgs)
  })

  it('should render Spin if users are fetching', () => {
    useGetOrganisationUsersQuery.mockImplementationOnce(() => ({
      data: {
        meta: { total: 2 },
        result: [],
      },
      isLoading: true,
    }))
    wrapper = shallow(<UsersCard />)

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
      navigationMap.management.organisationUsers(),
      expect.any(Function),
    )
  })
})
