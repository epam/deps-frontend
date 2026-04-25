
import { mockSelector } from '@/mocks/mockSelector'
import { WaitingForApprovalUser } from '@/models/WaitingForApprovalUser'

const orgUserManagementInviteesSelector = mockSelector([
  {
    email: 'test@test.ru',
  },
  {
    email: 'test2@test.ru',
  },
])

const orgUserManagementSelector = mockSelector({
  invitees: [
    {
      email: 'test@test.ru',
    },
    {
      email: 'test2@test.ru',
    },
  ],
})

const orgUserManagementWaitingForApprovalSelector = mockSelector([
  new WaitingForApprovalUser({
    creationDate: '20.08.2022',
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    organisation: 'org',
    pk: 'pk1',
    username: 'user1',
  }),
  new WaitingForApprovalUser({
    creationDate: '20.08.2022',
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    organisation: 'org',
    pk: 'pk2',
    username: 'user2',
  }),
])

export {
  orgUserManagementInviteesSelector,
  orgUserManagementSelector,
  orgUserManagementWaitingForApprovalSelector,
}
