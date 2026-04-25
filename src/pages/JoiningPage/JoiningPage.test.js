
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useParams } from 'react-router'
import { storeUser } from '@/actions/authorization'
import { fetchOrganisations } from '@/actions/organisations'
import { iamApi } from '@/api/iamApi'
import { StatusCode } from '@/enums/StatusCode'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { JoiningPage } from './JoiningPage'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/authorization')
jest.mock('@/actions/authorization', () => ({ storeUser: jest.fn() }))
jest.mock('@/actions/organisations', () => ({
  fetchOrganisations: jest.fn(),
}))
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(() => ({ orgPk: mockOrgPk })),
}))
jest.mock('@/api/iamApi', () => ({
  iamApi: {
    join: jest.fn(() => Promise.resolve(mockUser)),
  },
}))
jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

const mockOrgPk = 'mockOrgPk'
const mockHistoryState = { showGreeting: true }

const mockUser = new User(
  'test@email.com',
  'Test',
  'Tester',
  new Organisation(
    '1111',
    'TestOrganisation',
    null,
  ),
  'User',
  '1',
)

class ResponseError extends Error {
  constructor (response) {
    super()
    this.response = response
  }
}

const { ConnectedComponent, mapStateToProps, mapDispatchToProps } = JoiningPage

describe('Page: JoiningPage', () => {
  describe('mapStateToProps', () => {
    it('should call to userSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps()
      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should pass storeUser action as storeUser property', () => {
      const { props } = mapDispatchToProps()
      props.storeUser()
      expect(storeUser).toHaveBeenCalledTimes(1)
    })

    it('should call to fetchOrganisations action when calling to fetchOrganisations prop', () => {
      const { props } = mapDispatchToProps()
      props.fetchOrganisations()
      expect(fetchOrganisations).toHaveBeenCalledTimes(1)
    })
  })

  describe('ConnectedComponent', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        user: userSelector.getSelectorMockValue(),
        storeUser: jest.fn(),
        fetchOrganisations: jest.fn(),
      }
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correctly with spinning', () => {
      expect(wrapper).toMatchSnapshot()
    })

    describe('orgPk from url is not the same as current user orgPk', () => {
      it('should call iamApi.join api and store user', async () => {
        expect(iamApi.join).nthCalledWith(1, mockOrgPk)
      })

      it('should call storeUser in case of successful join request', () => {
        expect(defaultProps.storeUser).nthCalledWith(1, mockUser)
      })

      it('should call goTo with state in case of orgPk is not equal user.organisation.pk', () => {
        expect(goTo).nthCalledWith(1, navigationMap.home(), mockHistoryState)
      })

      it('should call fetchOrganisations in case of successful join request', () => {
        expect(defaultProps.fetchOrganisations).toBeCalled()
      })

      it('should redirect to waitingApproval page when join was failed with forbidden status', async () => {
        jest.clearAllMocks()
        iamApi.join.mockImplementationOnce(() => Promise.reject(
          new ResponseError({ status: StatusCode.FORBIDDEN })),
        )
        wrapper = shallow(<ConnectedComponent {...defaultProps} />)
        expect(await goTo).nthCalledWith(1, navigationMap.waitingApproval())
      })

      it('should redirect to noUserOrganisation page when join was failed with notFound status', async () => {
        jest.clearAllMocks()
        iamApi.join.mockImplementationOnce(() => Promise.reject(
          new ResponseError({ status: StatusCode.NOT_FOUND }),
        ))
        wrapper = shallow(<ConnectedComponent {...defaultProps} />)
        expect(await goTo).nthCalledWith(1, navigationMap.error.rootNotFound())
      })
    })

    it('should immediately redirect to home page in case orgPk from url is the same as current user orgPk', () => {
      jest.clearAllMocks()
      const user = userSelector.getSelectorMockValue()
      useParams.mockImplementationOnce(jest.fn(() => ({ orgPk: user.organisation.pk })))
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(goTo).nthCalledWith(1, navigationMap.home())
      expect(iamApi.join).not.toHaveBeenCalled()
    })
  })
})
