import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React, { useState } from 'react'
import { fetchDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'
import { Spin } from '@/components/Spin'
import { userSelector } from '@/selectors/authorization'
import { orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'
import { WaitingForApprovalTabTitle } from './WaitingForApprovalTabTitle'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(() => ([false, jest.fn()])),
}))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/orgUserManagementPage', () => ({
  fetchDefaultWaitingsMeta: jest.fn(),
}))

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/selectors/navigation')
jest.mock('@/selectors/orgUserManagement')
jest.mock('@/selectors/orgUserManagementPage')
jest.mock('@/selectors/authorization')

const {
  mapDispatchToProps,
  mapStateToProps,
  ConnectedComponent,
} = WaitingForApprovalTabTitle

describe('Container: WaitingForApprovalTabTitle', () => {
  describe('mapStateToProps', () => {
    it('should call userSelector and pass the result as user prop', () => {
      const { props } = mapStateToProps()

      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })

    it('should call to orgDefaultWaitingsMetaSelector with state and pass the result as waitingsDefaultMeta prop', () => {
      const { props } = mapStateToProps()
      expect(orgDefaultWaitingsMetaSelector).toHaveBeenCalled()
      expect(props.waitingsDefaultMeta).toEqual(orgDefaultWaitingsMetaSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should call to fetchDefaultWaitingsMeta action when calling to fetchDefaultWaitingsMeta prop', () => {
      const { props } = mapDispatchToProps()

      props.fetchDefaultWaitingsMeta()
      expect(fetchDefaultWaitingsMeta).toHaveBeenCalled()
    })
  })

  describe('ConnectedComponent', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        user: userSelector.getSelectorMockValue(),
        fetchDefaultWaitingsMeta: jest.fn(),
        waitingsDefaultMeta: orgDefaultWaitingsMetaSelector.getSelectorMockValue(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render component correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render spinner in case of fetching', () => {
      useState.mockImplementationOnce(jest.fn(() => ([true, jest.fn()])))
      const wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(wrapper.find(Spin.Centered).exists()).toEqual(true)
    })
  })
})
