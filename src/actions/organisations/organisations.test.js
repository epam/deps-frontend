
import { mockEnv } from '@/mocks/mockEnv'
import { storeOrganisations, changeOrgName, fetchOrganisations } from '@/actions/organisations'
import { iamApi } from '@/api/iamApi'
import { Organisation } from '@/models/Organisation'
import { organisationsSelector } from '@/selectors/organisations'

jest.mock('@/api/iamApi', () => ({
  iamApi: {
    getOrganisations: jest.fn(() => Promise.resolve({ organisations: mockOrganisations })),
    updateOrganisation: jest.fn(() => Promise.resolve(mockOrganisation)),
  },
}))
jest.mock('@/selectors/organisations')
jest.mock('@/actions/authorization')
jest.mock('@/utils/env', () => mockEnv)

const mockError = new Error('Mock Error Message')
const mockOrganisations = [new Organisation('1111', 'TestOrganisation')]
const mockOrganisation = new Organisation('1111', 'TestOrg')

describe('Action creator: changeOrgName', () => {
  let dispatch
  let getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn(() => ({
      authorization: {
        user: {},
      },
      organisations: [],
    }))
  })

  it('should call dispatch with storeOrganisations action', async () => {
    const organisations = organisationsSelector()
    await changeOrgName()(dispatch, getState)
    expect(dispatch).nthCalledWith(2, storeOrganisations(organisations))
  })

  it('should change organisation with the same pk', async () => {
    const { name, pk } = mockOrganisation
    await changeOrgName(pk, name)(dispatch, getState)
    expect(dispatch).nthCalledWith(2, storeOrganisations([mockOrganisation]))
  })
})

describe('Action creator: fetchOrganisations', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
    jest.clearAllMocks()
  })

  it('should call getOrganisations once', async () => {
    await fetchOrganisations()(dispatch)
    expect(iamApi.getOrganisations).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with organisations from response in case of success', async () => {
    await fetchOrganisations()(dispatch)
    expect(dispatch).nthCalledWith(2, storeOrganisations(mockOrganisations))
  })

  it('should throw error if getOrganisations rejected', async () => {
    console.warn = jest.fn()
    console.error = jest.fn()
    iamApi.getOrganisations.mockImplementationOnce(() => Promise.reject(mockError))
    await expect(fetchOrganisations()(dispatch)).rejects.toThrowError(mockError)
  })
})
