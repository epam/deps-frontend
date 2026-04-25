
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ContainerType } from '@/enums/ContainerType'
import { documentSelector } from '@/selectors/documentReviewPage'
import { EmailReviewPage } from './EmailReviewPage'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/containers/DocumentViewHeader', () => mockComponent('DocumentViewHeader'))
jest.mock('@/containers/EmailBody', () => mockComponent('EmailBody'))
jest.mock('@/containers/EmailAttachments', () => mockComponent('EmailAttachments'))
jest.mock('@/containers/EmailInfo', () => mockComponent('EmailInfo'))

const {
  mapStateToProps,
  ConnectedComponent,
} = EmailReviewPage

describe('Component: EmailReviewPage', () => {
  describe('react component', () => {
    let defaultProps, wrapper

    beforeEach(() => {
      defaultProps = {
        document: {
          ...documentSelector.getSelectorMockValue(),
          containerType: ContainerType.EMAIL,
          containerMetadata: {
            body: '<p>test</p>',
            recipients: ['To'],
            cc: ['CC'],
            date: 'BCC',
            sender: 'From',
            subject: 'Subject',
          },
        },
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout according to props', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('mapStateToProps', () => {
    const mockState = 'mockState'

    it('should pass document prop correctly from the state', () => {
      const { props } = mapStateToProps(mockState)
      expect(props.document).toEqual(documentSelector.getSelectorMockValue())
    })
  })
})
