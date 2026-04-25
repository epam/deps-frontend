
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { skipValidation } from '@/actions/documentReviewPage'
import { notifySuccess } from '@/utils/notification'
import { SkipValidationButton } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/actions/documentReviewPage', () => ({
  skipValidation: jest.fn(),
}))
jest.mock('@/utils/notification', () => ({
  notifySuccess: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

const { mapDispatchToProps, ConnectedComponent } = SkipValidationButton

describe('Component: SkipValidationButton', () => {
  describe('mergeProps', () => {
    it('should dispatch skipValidation action', () => {
      const ownProps = {
        documentId: 'Id',
        extractedData: {},
      }

      const { props } = mapDispatchToProps(undefined, ownProps)
      props.skipValidation()
      expect(skipValidation).toHaveBeenCalledTimes(1)
    })
  })

  describe('connected component', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        children: 'Skip Validation',
        disabled: false,
        skipValidation: jest.fn(() => Promise.resolve()),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call  props skipValidation when calling to skipValidation', async () => {
      await wrapper.instance().skipValidation()
      expect(defaultProps.skipValidation).nthCalledWith(1)
    })

    it('should call success in case of skipValidation ', async () => {
      await wrapper.instance().skipValidation()
      expect(notifySuccess).nthCalledWith(1, 'Document validation skipped')
    })
  })
})
