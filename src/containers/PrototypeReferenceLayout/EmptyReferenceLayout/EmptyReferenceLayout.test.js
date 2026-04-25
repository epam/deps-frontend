
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ReferenceLayoutUploader } from '../ReferenceLayoutUploader'
import { EmptyReferenceLayout } from './EmptyReferenceLayout'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: EmptyReferenceLayout', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      isUploadAvailable: true,
      addLayout: jest.fn(),
    }

    wrapper = shallow(<EmptyReferenceLayout {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render "add new" button on layout uploader', () => {
    const addNewButton = wrapper.find(ReferenceLayoutUploader).props().renderUploadTrigger()

    expect(addNewButton).toMatchSnapshot()
  })

  it('should not render layout uploader if false isUploadAvailable is provided', () => {
    defaultProps.isUploadAvailable = false

    wrapper.setProps(defaultProps)

    expect(wrapper.find(ReferenceLayoutUploader).exists()).toBe(false)
  })
})
