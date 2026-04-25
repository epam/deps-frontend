
import { mockEnv } from '@/mocks/mockEnv'
import { InviteesFilterKeys, OrgWaitingsFilterKeys, PaginationKeys } from '@/constants/navigation'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'
import {
  activateUserOrganisation,
  getMe,
  getOrganisations,
  getUser,
  updateOrganisation,
  inviteUsers,
  invitedUsers,
  declineInvitedUsers,
  join,
  waitingForApproval,
  declineWaitingUsers,
  approveUsers,
} from './iamApi'

jest.mock('@/utils/apiRequest')

jest.mock('@/utils/env', () => ({
  ENV: {
    ...mockEnv.ENV,
    AUTH_TYPE: 'oidc',
  },
}))

const FILTER_CONFIG_TO_SEARCH_PARAMS_MAPPING = {
  [InviteesFilterKeys.EMAIL]: 'email',
  [OrgWaitingsFilterKeys.USER]: 'fullName',
  SORT: 'sortBy',
}

describe('API: IAM', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('method getUser should call to the apiRequest.get with correct url', async () => {
    const MOCK_USER_ID = 'user-uuid'
    const FAKE_API_RESPONSE_PROFILE = new User(
      'test@test.com',
      'Mick',
      'Jagger',
      null,
      'mickJagger',
    )

    apiRequest.get.mockImplementation(() =>
      Promise.resolve(FAKE_API_RESPONSE_PROFILE),
    )

    const user = await getUser(MOCK_USER_ID)

    expect(apiRequest.get).toHaveBeenCalledWith(apiMap.apiGatewayV2.v5.iam.users.user(MOCK_USER_ID))
    expect(user).toEqual({
      [MOCK_USER_ID]: FAKE_API_RESPONSE_PROFILE,
    })
  })

  it('method getMe should call to the apiRequest.getMe with correct url', async () => {
    const FAKE_API_RESPONSE_PROFILE = new User(
      'test@test.com',
      'Mick',
      'Jagger',
      null,
      'mickJagger',
    )

    apiRequest.get.mockImplementation(() =>
      Promise.resolve(FAKE_API_RESPONSE_PROFILE),
    )

    const user = await getMe()

    expect(apiRequest.get).toHaveBeenCalledWith(apiMap.apiGatewayV2.v5.iam.users.me())
    expect(user).toEqual(FAKE_API_RESPONSE_PROFILE)
  })

  it('method getOrganisations should call to the apiRequest.get with correct url', async () => {
    const FAKE_API_RESPONSE_PROFILE = [new Organisation('1111', 'TestOrganisation')]

    apiRequest.get.mockImplementation(() =>
      Promise.resolve(FAKE_API_RESPONSE_PROFILE),
    )

    const organisations = await getOrganisations()

    expect(apiRequest.get).toHaveBeenCalledWith(apiMap.apiGatewayV2.v5.iam.organisations())
    expect(organisations).toEqual(FAKE_API_RESPONSE_PROFILE)
  })

  it('method activateUserOrganisation should call to the apiRequest.post with correct url', async () => {
    const mockOrganisationPk = 'testPk'

    await activateUserOrganisation(mockOrganisationPk)

    expect(apiRequest.post).toHaveBeenCalledWith(apiMap.apiGatewayV2.v5.iam.organisation.activate(mockOrganisationPk))
  })

  it('method updateOrganisation should call to the apiRequest.patch with correct url and argument', async () => {
    const mockOrganisationName = 'Test'
    const mockOrganisationPk = 'testPk'

    await updateOrganisation(mockOrganisationPk, mockOrganisationName)

    expect(apiRequest.patch).toHaveBeenCalledWith(
      apiMap.apiGatewayV2.v5.iam.organisation(mockOrganisationPk),
      { name: mockOrganisationName },
    )
  })

  it('method inviteUsers should call to the apiRequest.post with correct url', async () => {
    const mockOrganisationPk = 'testPk'
    const mockEmails = ['test1@mail.com', 'test2@mail.com']

    await inviteUsers(mockEmails, mockOrganisationPk)

    expect(apiRequest.post).toHaveBeenCalledWith(
      apiMap.apiGatewayV2.v5.iam.organisation.invite(mockOrganisationPk),
      mockEmails,
    )
  })

  it('method invitedUsers should call to the apiRequest.get with correct url', async () => {
    const mockOrganisationPk = 'testPk'

    const filters = {
      [PaginationKeys.PAGE]: 1,
      [PaginationKeys.PER_PAGE]: 10,
      [InviteesFilterKeys.EMAIL]: 'test@mail.com',
    }

    await invitedUsers(mockOrganisationPk, filters)

    expect(apiRequest.get).toHaveBeenCalledWith(apiMap.apiGatewayV2.v5.iam.organisation.invitees(mockOrganisationPk, filters))
  })

  it('method declineInvitedUsers should call to the apiRequest.delete with correct url', async () => {
    const mockOrganisationPk = 'testPk'
    const invitees = [{
      email: 'test@mail.com',
    }]

    await declineInvitedUsers(invitees, mockOrganisationPk)

    expect(apiRequest.delete).toHaveBeenCalledWith(
      apiMap.apiGatewayV2.v5.iam.organisation.invitees(mockOrganisationPk),
      { data: { invitees } },
    )
  })

  it('method join should call to the apiRequest.post with correct url', async () => {
    const mockOrganisationPk = 'testPk'

    await join(mockOrganisationPk)

    expect(apiRequest.post).toHaveBeenCalledWith(apiMap.apiGatewayV2.v5.iam.organisation.join(mockOrganisationPk))
  })

  it('method waitingForApproval should call to the apiRequest.get with correct url', async () => {
    const mockOrganisationPk = 'testPk'

    const filters = {
      [PaginationKeys.PAGE]: 1,
      [PaginationKeys.PER_PAGE]: 10,
      [OrgWaitingsFilterKeys.USER]: 'userPk1',
    }

    const expectedFilters = {
      [PaginationKeys.PAGE]: filters.page,
      [PaginationKeys.PER_PAGE]: filters.perPage,
      [FILTER_CONFIG_TO_SEARCH_PARAMS_MAPPING[OrgWaitingsFilterKeys.USER]]: filters.user,
    }

    await waitingForApproval(mockOrganisationPk, filters)

    expect(apiRequest.get).toHaveBeenCalledWith(apiMap.apiGatewayV2.v5.iam.organisation.approvals(mockOrganisationPk, expectedFilters))
  })

  it('method declineWaitingUsers should call to the apiRequest.delete with correct url', async () => {
    const mockOrganisationPk = 'testPk'
    const userIds = ['userId1', 'userId2']

    await declineWaitingUsers(userIds, mockOrganisationPk)

    expect(apiRequest.delete).toHaveBeenCalledWith(
      apiMap.apiGatewayV2.v5.iam.organisation.approvals(mockOrganisationPk),
      { data: { userIds } },
    )
  })

  it('method approveUsers should call to the apiRequest.post with correct url', async () => {
    const mockOrganisationPk = 'testPk'
    const userIds = ['userId1', 'userId2']

    await approveUsers(userIds, mockOrganisationPk)

    expect(apiRequest.post).toHaveBeenCalledWith(
      apiMap.apiGatewayV2.v5.iam.organisation.approve(mockOrganisationPk),
      { userIds },
    )
  })
})
