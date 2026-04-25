
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { iamApi } from '@/api/iamApi'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Tag } from '@/components/Tag'
import { StatusCode } from '@/enums/StatusCode'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { EmailListDrawer } from './EmailListDrawer'
import { InviteByEmail } from './InviteByEmail'
import {
  StyledAddEmailButton,
  StyledListEmailsButton,
  Hint,
} from './InviteByEmail.styles'

jest.mock('@/selectors/authorization')

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/api/iamApi', () => ({
  iamApi: {
    inviteUsers: jest.fn(() => Promise.resolve()),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

class ResponseError extends Error {
  constructor (response) {
    super()
    this.response = response
  }
}

const invalidEmails = [
  'test[@test.com',
  'test)@test.com',
  'test|@test.com',
  'test#@test.com',
  'test=@test.com',
  'test+@test.com',
  'test<@test.com',
  'test>@test.com',
  'test%@test.com',
  'test\'@test.com',
  'test/@test.com',
  'test|@test.com',
  'test;@test.com',
  'test(@test.com',
  'test)@test.com',
  'test:@test.com',
  'test[@test.com',
  'test]@test.com',
  'te[st@test.com',
  'te)st@test.com',
  'te|st@test.com',
  'te#st@test.com',
  'te=st@test.com',
  'te+st@test.com',
  'te<st@test.com',
  'te>st@test.com',
  'te%st@test.com',
  'te\'st@test.com',
  'te/st@test.com',
  'te|st@test.com',
  'te;st@test.com',
  'te(st@test.com',
  'te)st@test.com',
  'te:st@test.com',
  'te[st@test.com',
  'te]st@test.com',
  '[test@test.com',
  ')test@test.com',
  '|test@test.com',
  '#test@test.com',
  '=test@test.com',
  '+test@test.com',
  '<test@test.com',
  '>test@test.com',
  '%test@test.com',
  '\'test@test.com',
  '/test@test.com',
  '|test@test.com',
  ';test@test.com',
  '(test@test.com',
  ')test@test.com',
  ':test@test.com',
  '[test@test.com',
  ']test@test.com',
  'test@test].com',
  'test@test.]com',
  'test@test..com',
  'test@.test.com',
  'test@тест.com',
  'тест@test.com',
  'test@test.ком',
]

const validEmails = [
  'test@example.com',
  'test@exaMple.com',
  'TEST@example.com',
  'TesT@exAmple.com',
  'test.test@example.com',
  'test.test123@example.com',
  '123@example.com',
  'test@example.test.com',
  'test.email1234@example.org',
  'test_test@example.net',
  'test@test.123',
  '123@123.test',
]

const { ConnectedComponent, mapStateToProps } = InviteByEmail

describe('Container: InviteByEmail', () => {
  describe('mapStateToProps', () => {
    it('should call to userSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps()
      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })
  })

  describe('Connected Component', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        onClose: jest.fn(),
        user: new User(
          'test@test.com',
          'Test',
          'Test',
          new Organisation('deps-test', 'TestOrganisation'),
          'test',
          'test',
        ),
        fetchInvitedUsersByFilter: jest.fn(),
        fetchWaitingForApprovalUsersByFilter: jest.fn(),
        fetchDefaultInviteesMeta: jest.fn(),
        fetchDefaultWaitingsMeta: jest.fn(),
        refetchUsers: jest.fn(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render correctly Clear All Button', () => {
      wrapper.find(Input).props().onChange({ target: { value: validEmails[0] } })
      wrapper.find(StyledAddEmailButton).props().onClick()
      expect(wrapper).toMatchSnapshot()
    })

    it('should render Hint if at least one email is added', () => {
      wrapper.find(Input).props().onChange({ target: { value: validEmails[0] } })
      wrapper.find(StyledAddEmailButton).props().onClick()
      const EmailHint = wrapper.find(Hint)

      expect(EmailHint.exists()).toEqual(true)
    })

    it('should not render Hint if no emails are added', () => {
      const EmailHint = wrapper.find(Hint)

      expect(EmailHint.exists()).toEqual(false)
    })

    it('should call notifySuccess on send click', () => {
      wrapper.find(Button).props().onClick()
      expect(mockNotification.notifyProgress).nthCalledWith(1, 'Sending invites...')
    })

    it('should call notifySuccess on send click', () => {
      wrapper.find(Button).props().onClick()
      expect(mockNotification.notifySuccess).nthCalledWith(1, 'Invitations were sent successfully')
    })

    it('should call fetchInvitedUsersByFilter, fetchWaitingForApprovalUsersByFilter and refetchUsers after sending an invite', async () => {
      const { refetchUsers, fetchInvitedUsersByFilter, fetchWaitingForApprovalUsersByFilter, user } = defaultProps
      await wrapper.find(Button).props().onClick()
      expect(fetchInvitedUsersByFilter).nthCalledWith(1, user.organisation.pk)
      expect(fetchWaitingForApprovalUsersByFilter).nthCalledWith(1, user.organisation.pk)
      expect(refetchUsers).toHaveBeenCalledTimes(1)
    })

    it('should call fetchDefaultInviteesMeta after sending an invite', async () => {
      const { fetchDefaultInviteesMeta, user } = defaultProps
      await wrapper.find(Button).props().onClick()
      expect(fetchDefaultInviteesMeta).nthCalledWith(1, user.organisation.pk)
    })

    it('should call fetchDefaultWaitingsMeta after sending an invite', async () => {
      const { fetchDefaultWaitingsMeta, user } = defaultProps
      await wrapper.find(Button).props().onClick()
      expect(fetchDefaultWaitingsMeta).nthCalledWith(1, user.organisation.pk)
    })

    it('should call notifyWarning on send click', async () => {
      iamApi.inviteUsers.mockImplementationOnce(() => Promise.reject(new Error('error')))
      await wrapper.find(Button).props().onClick()
      expect(mockNotification.notifyWarning).nthCalledWith(1, 'Something went wrong during sending invites')
    })

    it('should call notifyWarning with correct message in case invitation is sent to the same email several times', async () => {
      jest.clearAllMocks()
      iamApi.inviteUsers.mockImplementationOnce(() => Promise.reject(
        new ResponseError({ status: StatusCode.CONFLICT })),
      )
      await wrapper.find(Button).props().onClick()
      expect(mockNotification.notifyWarning).nthCalledWith(1, 'An invitation has already been sent to this email')
    })

    it('should call onClose on send click', async () => {
      await wrapper.find(Button).props().onClick()
      expect(defaultProps.onClose).toBeCalled()
    })

    it('should appear EmailListDrawer', async () => {
      wrapper.find(StyledListEmailsButton).props().onClick()
      expect(wrapper.find(EmailListDrawer).props().visible).toBe(true)
    })

    it('should become able StyledAddEmailButton if email passes validation and become disable if email went to list', async () => {
      wrapper.find(Input).props().onChange({ target: { value: validEmails[0] } })
      expect(wrapper.find(StyledAddEmailButton).props().disabled).toBe(false)
      wrapper.find(StyledAddEmailButton).props().onClick()
      expect(wrapper.find(StyledAddEmailButton).props().disabled).toBe(true)
    })

    it('should get into input after onDoubleClick on an email in list', async () => {
      wrapper.find(Input).props().onChange({ target: { value: validEmails[0] } })
      wrapper.find(StyledAddEmailButton).props().onClick()
      wrapper.find(Tag).props().onDoubleClick()

      expect(wrapper.find(Input).props().value).toBe(validEmails[0])
      expect(wrapper.find(StyledAddEmailButton).props().disabled).toBe(false)
    })

    it('should be disabled Send invites button for invalid emails', async () => {
      jest.clearAllMocks()
      invalidEmails.forEach(async (email) => {
        wrapper = shallow(<ConnectedComponent {...defaultProps} />)
        wrapper.find(Input).props().onChange({ target: { value: email } })
        expect(wrapper.find(Button).props().disabled).toBe(true)
      })
    })

    it('should call iamApi.inviteUsers for valid emails', async () => {
      jest.clearAllMocks()
      validEmails.forEach(async (email) => {
        wrapper = shallow(<ConnectedComponent {...defaultProps} />)
        wrapper.find(Input).props().onChange({ target: { value: email } })
        await wrapper.find(Button).props().onClick()
        expect(iamApi.inviteUsers).toBeCalledWith([{ email }], defaultProps.user.organisation.pk)
      })
    })
  })
})
