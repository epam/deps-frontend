
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { fetchGenAiFields } from '@/actions/genAiData'
import { Spin } from '@/components/Spin'
import { genAiFieldsSelector } from '@/selectors/genAiData'
import { areGenAiFieldsFetchingSelector } from '@/selectors/requests'
import { EmptyData } from './EmptyData'
import { GenAiData } from './'

const mockDispatch = jest.fn((action) => action)

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))
jest.mock('@/actions/genAiData', () => ({
  fetchGenAiFields: jest.fn(),
}))

jest.mock('@/selectors/genAiData')
jest.mock('@/selectors/requests')
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/env', () => mockEnv)

describe('Container: GenAiData', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      openChat: jest.fn(),
    }

    wrapper = shallow(<GenAiData {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call dispatch with fetchGenAiFields action once', () => {
    expect(mockDispatch).nthCalledWith(1, fetchGenAiFields())
  })

  it('should render Spin when fields are fetching, and no fields obtained', () => {
    areGenAiFieldsFetchingSelector.mockImplementationOnce(() => true)
    genAiFieldsSelector.mockImplementationOnce(() => [])

    wrapper = shallow(<GenAiData {...defaultProps} />)

    expect(wrapper.find(Spin).exists()).toEqual(true)
  })

  it('should render empty in case of no fields', () => {
    genAiFieldsSelector.mockImplementationOnce(() => [])
    areGenAiFieldsFetchingSelector.mockImplementationOnce(() => false)
    wrapper = shallow(<GenAiData {...defaultProps} />)

    expect(wrapper.find(EmptyData).exists()).toEqual(true)
  })

  it('should call openChat when call onClick prop in EmptyData component', () => {
    genAiFieldsSelector.mockImplementationOnce(() => [])
    areGenAiFieldsFetchingSelector.mockImplementationOnce(() => false)
    wrapper = shallow(<GenAiData {...defaultProps} />)

    wrapper.find(EmptyData).props().onClick()

    expect(defaultProps.openChat).toHaveBeenCalled()
  })
})
