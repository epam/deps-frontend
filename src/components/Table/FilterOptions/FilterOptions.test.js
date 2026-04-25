
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import React from 'react'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { SelectOption } from '@/components/Select'
import { FilterOptions } from './FilterOptions'
import { CheckboxItem, FooterButtons } from './FilterOptions.styles'

const mockVal = 'test'
const testSource = new SelectOption(mockVal, 'test')

jest.mock('@/utils/env', () => mockEnv)

describe('Component: FilterOptions', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      options: [
        testSource,
      ],
      savedKeys: [mockVal],
      confirmFilter: jest.fn(),
      setSelectedKeys: jest.fn(),
      filter: '',
    }

    wrapper = shallow(<FilterOptions {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call confirmFilter prop with correct argument in case of onOk call', () => {
    const event = {
      target: {
        checked: true,
        id: mockVal,
      },
    }
    wrapper.find(CheckboxItem).props().onChange(event)
    wrapper.find(Button).at(0).props().onClick()
    expect(defaultProps.confirmFilter).nthCalledWith(1, [mockVal])
  })

  it('should call confirmFilter prop with correct argument in case of onResetClick call', () => {
    wrapper.find(Button).at(1).props().onClick()
    expect(defaultProps.confirmFilter).nthCalledWith(1, [])
  })

  it('should not render footer buttons if no selected or saved keys', () => {
    wrapper.setProps({
      ...defaultProps,
      savedKeys: [],
    })

    expect(wrapper.find(FooterButtons).exists()).toEqual(false)
  })

  it('should render selected options first in order they were selected', () => {
    const mockSelectedKeys = ['key4', 'key2']
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [mockSelectedKeys, jest.fn()])

    const options = [
      new SelectOption('key1', 'text1'),
      new SelectOption('key2', 'text2'),
      new SelectOption('key3', 'text3'),
      new SelectOption('key4', 'text4'),
    ]

    const props = {
      ...defaultProps,
      options,
    }

    wrapper = shallow(<FilterOptions {...props} />)

    expect(wrapper.find(Checkbox).at(0).props().id).toEqual('key4')
    expect(wrapper.find(Checkbox).at(1).props().id).toEqual('key2')
    expect(wrapper.find(Checkbox).at(2).props().id).toEqual('key1')
    expect(wrapper.find(Checkbox).at(3).props().id).toEqual('key3')
  })
})
