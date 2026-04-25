
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { ExtractedDataSchema, OutputProfile, ExportingType } from '@/models/OutputProfile'
import { Tabs } from './ProfilesTabs.styles'
import { ProfilesTabs } from '.'

const mockFirstProfile = new OutputProfile({
  id: 'firstId',
  name: 'firstName',
  creationDate: '12-12-2000',
  version: '1.0.0',
  schema: new ExtractedDataSchema({
    fields: [],
    needsValidationResults: false,
  }),
  format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
  exportingType: ExportingType.BUILT_IN,
})

const mockSecondProfile = new OutputProfile({
  id: 'secondId',
  name: 'secondName',
  creationDate: '12-12-2000',
  version: '2.0.0',
  schema: new ExtractedDataSchema({
    fields: [],
    needsValidationResults: false,
  }),
  format: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
  exportingType: ExportingType.BUILT_IN,
})

const profiles = [mockFirstProfile, mockSecondProfile]

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentTypesListPage')

describe('Container: ProfilesTabs', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      activeProfile: mockFirstProfile,
      setActiveProfile: jest.fn(),
      fields: [],
      profiles,
    }
  })

  it('should render correct layout', () => {
    wrapper = shallow(<ProfilesTabs {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should call setActiveProfile when call onChange prop in Tabs container', async () => {
    wrapper = shallow(<ProfilesTabs {...defaultProps} />)

    wrapper.find(Tabs).props().onChange(mockFirstProfile.id)

    expect(defaultProps.setActiveProfile).nthCalledWith(1, mockFirstProfile)
  })

  it('should not render Tabs if there is only one profile', async () => {
    wrapper = shallow(<ProfilesTabs {...defaultProps} />)

    wrapper.setProps({
      ...defaultProps,
      profiles: [mockFirstProfile],
    })

    expect(wrapper.find(Tabs).exists()).toBe(false)
  })

  it('should handle null activeProfile gracefully', () => {
    const propsWithNullProfile = {
      ...defaultProps,
      activeProfile: null,
    }

    wrapper = shallow(<ProfilesTabs {...propsWithNullProfile} />)

    expect(wrapper.find(Tabs).props().activeKey).toBeUndefined()
  })
})
