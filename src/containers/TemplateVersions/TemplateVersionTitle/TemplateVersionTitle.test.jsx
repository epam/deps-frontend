
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { Input } from '@/components/Input'
import { TemplateVersionTitle } from './TemplateVersionTitle'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

const mockedEvent = {
  target: {
    value: 'testValue',
  },
}

const mockTitle = 'testTitle'
const mockPlaceholder = 'testPlaceholder'

describe('Component: TemplateVersionTitle', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      defaultTitle: mockTitle,
      isEditable: true,
      updateVersionName: jest.fn(),
      placeholder: mockPlaceholder,
    }

    wrapper = shallow(<TemplateVersionTitle {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly if title is not editable', () => {
    defaultProps.isEditable = false

    wrapper = shallow(<TemplateVersionTitle {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should call updateVersionName when blur input', async () => {
    wrapper.find(Input).props().onBlur()

    expect(defaultProps.updateVersionName).nthCalledWith(1, defaultProps.defaultTitle)
  })

  it('should call updateVersionName when press enter after focus input', async () => {
    wrapper.find(Input).props().onPressEnter()

    expect(defaultProps.updateVersionName).nthCalledWith(1, defaultProps.defaultTitle)
  })

  it('should change input value when call changeTitle', async () => {
    wrapper.find(Input).props().onChange(mockedEvent)

    expect(wrapper.find(Input).props().value).toBe(mockedEvent.target.value)
  })

  it('should call updateVersionName with default value if input value is empty', async () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => ['', jest.fn()])

    wrapper = shallow(<TemplateVersionTitle {...defaultProps} />)

    wrapper.find(Input).props().onPressEnter()

    expect(defaultProps.updateVersionName).nthCalledWith(1, defaultProps.defaultTitle)
  })
})
