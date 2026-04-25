
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React, { useState } from 'react'
import { fetchDefaultInviteesMeta } from '@/actions/orgUserManagementPage'
import { Spin } from '@/components/Spin'
import { userSelector } from '@/selectors/authorization'
import { orgDefaultInviteesMetaSelector } from '@/selectors/orgUserManagementPage'
import { InviteesTabTitle } from './InviteesTabTitle'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(() => ([false, jest.fn()])),
}))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/orgUserManagementPage')
jest.mock('@/actions/orgUserManagementPage', () => ({
  fetchDefaultInviteesMeta: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

const { ConnectedComponent, mapStateToProps, mapDispatchToProps } = InviteesTabTitle
const mockState = 'mockState'

describe('Container: InviteesTabTitle', () => {
  describe('mapStateToProps', () => {
    it('should call to userSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps(mockState)
      expect(userSelector).toHaveBeenCalledWith(mockState)
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })

    it('should call to orgDefaultInviteesMetaSelector with state and pass the result as inviteesDefaultMeta prop', () => {
      const { props } = mapStateToProps()
      expect(orgDefaultInviteesMetaSelector).toHaveBeenCalled()
      expect(props.inviteesDefaultMeta).toEqual(orgDefaultInviteesMetaSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should call to fetchDefaultInviteesMeta action when calling to fetchDefaultInviteesMeta prop', () => {
      const { props } = mapDispatchToProps()

      props.fetchDefaultInviteesMeta()
      expect(fetchDefaultInviteesMeta).toHaveBeenCalled()
    })
  })

  describe('ConnectedComponent', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        user: userSelector.getSelectorMockValue(),
        fetchDefaultInviteesMeta: jest.fn(),
        inviteesDefaultMeta: orgDefaultInviteesMetaSelector.getSelectorMockValue(),
      }
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render spinner in case of fetching', () => {
      useState.mockImplementationOnce(jest.fn(() => ([true, jest.fn()])))
      const wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(wrapper.find(Spin.Centered).exists()).toEqual(true)
    })
  })
})
