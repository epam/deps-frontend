
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { setSelection } from '@/actions/navigation'
import { useDeleteOrganisationUsersMutation } from '@/apiRTK/iamApi'
import { authenticationProvider } from '@/authentication'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { localize, Localization } from '@/localization/i18n'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { selectionSelector } from '@/selectors/navigation'
import { notifyWarning } from '@/utils/notification'
import { DeleteUsersButton } from './DeleteUsersButton'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/navigation', () => ({
  setSelection: jest.fn(),
}))
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/authorization')

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
}))

jest.mock('@/authentication', () => ({
  authenticationProvider: {
    signOut: jest.fn(),
  },
}))

const deleteUsersFnResponse = jest.fn()
deleteUsersFnResponse.unwrap = () => Promise.resolve({ deletedUsers: ['1'] })

const mockDeleteUsersFn = jest.fn(() => deleteUsersFnResponse)

jest.mock('@/apiRTK/iamApi', () => ({
  useDeleteOrganisationUsersMutation: () => ([
    mockDeleteUsersFn,
  ]),
  useGetOrganisationUsersQuery: jest.fn(() => ({
    data: {
      meta: { total: 2 },
      result: [mockUser],
    },
  })),
}))

const mockSelectedUsers = ['1', '2']
const mockUser = new User(
  'system@email.com',
  'Test',
  'Tester',
  new Organisation(
    '1111',
    'TestOrganisation',
    'http://host/customization.js',
  ),
  'SystemUser',
  '1',
)
const mockOrganisations = []

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = DeleteUsersButton

describe('Container: DeleteUsersButton', () => {
  describe('mapDispatchToProps', () => {
    it('should pass setSelection action as setSelection property', () => {
      const { props } = mapDispatchToProps()

      props.setSelection()
      expect(setSelection).toHaveBeenCalledTimes(1)
    })
  })

  describe('mapStateToProps', () => {
    it('should call selectionSelector and pass the result as selectedUsers prop', () => {
      const { props } = mapStateToProps()

      expect(selectionSelector).toHaveBeenCalled()
      expect(props.selectedUsers).toEqual(selectionSelector.getSelectorMockValue())
    })

    it('should call userSelector and pass the result as user prop', () => {
      const { props } = mapStateToProps()

      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })
  })

  describe('ConnectedComponent', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        setSelection: jest.fn(),
        selectedUsers: selectionSelector.getSelectorMockValue(),
        user: userSelector.getSelectorMockValue(),
      }
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should show confirmation dialog on clicking DeleteUsersButton', () => {
      Modal.confirm = jest.fn()
      wrapper.find(Button.Secondary).props().onClick()
      expect(Modal.confirm).toHaveBeenCalledTimes(1)
    })

    it('should not call Modal.confirm and should call notifyWarning on clicking DeleteUsersButton in case all users are selected for deletion', () => {
      Modal.confirm = jest.fn()
      defaultProps.selectedUsers = mockSelectedUsers
      wrapper.setProps(defaultProps)
      wrapper.find(Button.Secondary).props().onClick()
      expect(Modal.confirm).toHaveBeenCalledTimes(0)
      expect(notifyWarning).nthCalledWith(1, localize(Localization.ALL_USERS_DELETION))
    })

    it('should call action setSelection after deletion of users', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.find(Button.Secondary).props().onClick()
      expect(setSelection).toHaveBeenCalled()
    })

    it('should call deleteUsers with correct arguments when clicking DeleteUsersButton', async () => {
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.find(Button.Secondary).props().onClick()
      const [deleteUsers] = useDeleteOrganisationUsersMutation()
      expect(deleteUsers).nthCalledWith(1, {
        orgPk: defaultProps.user.organisation.pk,
        userIds: defaultProps.selectedUsers,
      })
    })

    it('should call authenticationProvider.signOut in case user removed himself from organisation and doesn\'t have other organisations', async () => {
      defaultProps.organisations = mockOrganisations
      defaultProps.user = mockUser
      wrapper.setProps(defaultProps)
      Modal.confirm = jest.fn().mockImplementationOnce((config) => config.onOk())
      await wrapper.find(Button.Secondary).props().onClick()
      expect(authenticationProvider.signOut).toHaveBeenCalled()
    })
  })
})
