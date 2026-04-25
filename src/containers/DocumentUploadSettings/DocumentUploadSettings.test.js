
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { DocumentUploadSettings } from './DocumentUploadSettings'
import { ResetButton, Drawer } from './DocumentUploadSettings.styles'

const mockReset = jest.fn()

const mockFormValues = {
  processingTypes: ['NER'],
  shouldExtractData: true,
  shouldAssignToMe: false,
}

const mockSubscription = {
  unsubscribe: jest.fn(),
}

let mockOnUnmount

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact({
  mockUseEffect: jest.fn((f) => {
    mockOnUnmount = f()
  }),
}))
jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockFormValues),
    reset: mockReset,
    watch: jest.fn(() => mockSubscription),
  })),
}))

describe('Container: DocumentUploadSettings', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      isVisible: true,
      setSettings: jest.fn(),
      onClose: jest.fn(),
    }

    wrapper = shallow(<DocumentUploadSettings {...defaultProps} />)
  })

  it('should render DocumentUploadSettings', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call reset when click on ResetButton', () => {
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)
    DrawerFooter.find(ResetButton).props().onClick()

    expect(mockReset).toHaveBeenCalled()
  })

  it('should call onClose callback when click on close button', () => {
    wrapper.find(Drawer).props().onClose()

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should call unsubscribe when unmount component', () => {
    jest.clearAllMocks()

    wrapper = shallow(<DocumentUploadSettings {...defaultProps} />)

    mockOnUnmount()

    expect(mockSubscription.unsubscribe).toHaveBeenCalled()
  })
})
