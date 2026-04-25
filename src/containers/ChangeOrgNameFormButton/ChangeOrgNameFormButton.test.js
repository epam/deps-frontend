/* eslint-disable testing-library/render-result-naming-convention */

import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { changeOrgName } from '@/actions/organisations'
import { ModalButton } from '@/components/ModalButton'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { FIELDS_CODE } from './ChangeOrganisationForm'
import { ChangeOrgNameFormButton } from './ChangeOrgNameFormButton'

const mockValues = {
  [FIELDS_CODE.newOrganisationName]: 'new mock org name',
}

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockValues),
    formState: {
      isValid: true,
      isDirty: true,
    },
  })),
}))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('./ChangeOrganisationForm', () => ({
  ...jest.requireActual('./ChangeOrganisationForm'),
  ...mockComponent('ChangeOrganisationForm'),
}))
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/actions/organisations', () => ({
  changeOrgName: jest.fn(),
}))
jest.mock('@/selectors/authorization')
jest.mock('@/utils/env', () => mockEnv)

const { ConnectedComponent, mapDispatchToProps, mapStateToProps } = ChangeOrgNameFormButton

describe('Container: ChangeOrgNameFormButton', () => {
  describe('mapStateToProps', () => {
    it('should call to userSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps()
      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should dispatch changeOrgName action', () => {
      const { props } = mapDispatchToProps()
      props.changeOrgName()
      expect(changeOrgName).toHaveBeenCalled()
    })
  })

  describe('Connected Component', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        changeOrgName: jest.fn(),
        user: new User(
          'test@test.com',
          'Test',
          'Test',
          new Organisation('mockPk', 'TestOrganisation'),
          'test',
          'test',
        ),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render container correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render button correctly', () => {
      const Button = wrapper.find(ModalButton).props().renderOpenTrigger
      expect(shallow(<Button />)).toMatchSnapshot()
    })

    it('should call changeOrgName in case onOk call ', () => {
      wrapper.find(ModalButton).props().onOk()
      expect(defaultProps.changeOrgName).toHaveBeenCalled()
    })

    it('should call notifyRequest with correct message in case onOk call', () => {
      wrapper.find(ModalButton).props().onOk()
      expect(mockNotification.notifyProgress).nthCalledWith(1, 'Changing Organization name ...')
    })

    it('should call success with correct message in case onOk call', () => {
      wrapper.find(ModalButton).props().onOk()
      expect(mockNotification.notifySuccess).nthCalledWith(1, 'Organization name was changed successfully')
    })

    it('should call warning with correct message in case onOk call', async () => {
      defaultProps.changeOrgName.mockImplementationOnce(() => Promise.reject(new Error('error')))
      try {
        await wrapper.find(ModalButton).props().onOk()
      } catch (err) {
        expect(err.message).toBe('error')
      }
      expect(mockNotification.notifyWarning).nthCalledWith(1, 'Something went wrong during Organization name changing')
    })
  })
})
