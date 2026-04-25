
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { documentsApi } from '@/api/documentsApi'
import { Spin } from '@/components/Spin'
import { DocumentFilterKeys, PaginationKeys } from '@/constants/navigation'
import { DocumentState } from '@/enums/DocumentState'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { DocumentTypesByStateDrawer } from '.'

const mockResponse = {
  meta: {
    total: 10,
  },
}

jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/containers/InView', () => mockComponent('InView'))

jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    getDocuments: jest.fn(() => Promise.resolve(mockResponse)),
  },
}))

describe('Container: DocumentTypesByStateDrawer', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      activeState: {
        name: localize(Localization.IN_REVIEW),
        states: [DocumentState.IN_REVIEW],
      },
      closeDrawer: jest.fn(),
    }

    wrapper = shallow(<DocumentTypesByStateDrawer {...defaultProps} />)
  })

  it('should render DocumentTypesByStateDrawer with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call documentApi.getDocuments when render component', () => {
    expect(documentsApi.getDocuments).nthCalledWith(1, {
      [DocumentFilterKeys.STATES]: defaultProps.activeState.states,
      [PaginationKeys.PER_PAGE]: 1,
    })
  })

  it('should show warning if request throws an error', async () => {
    documentsApi.getDocuments.mockImplementationOnce(() => Promise.reject(new Error('error')))

    wrapper = shallow(<DocumentTypesByStateDrawer {...defaultProps} />)

    expect(await notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })

  it('should not call documentApi.getDocuments if drawer is hidden', () => {
    jest.clearAllMocks()

    defaultProps.activeState = null

    wrapper = shallow(<DocumentTypesByStateDrawer {...defaultProps} />)

    expect(documentsApi.getDocuments).not.toHaveBeenCalled()
  })

  it('should show spinning Spin if documentsAmount is fetching', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [0, jest.fn()])
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()])

    wrapper = shallow(<DocumentTypesByStateDrawer {...defaultProps} />)

    expect(wrapper.find(Spin).props().spinning).toBe(true)
  })
})
