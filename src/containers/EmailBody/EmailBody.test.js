
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import sanitizeHtml from 'sanitize-html'
import { Expander } from '@/components/Expander'
import { documentSelector } from '@/selectors/documentReviewPage'
import { EmailBody } from './EmailBody'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/selectors/documentReviewPage')

jest.mock('sanitize-html', () => jest.fn((el) => el))

const { ConnectedComponent } = EmailBody

describe('Component: EmailBody', () => {
  const defaultProps = {
    document: {
      ...documentSelector.getSelectorMockValue(),
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
  let wrapper, expander

  beforeEach(() => {
    sanitizeHtml.mockClear()
    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    expander = shallow(
      <div>
        {wrapper.find(Expander).props().children(false, jest.fn())}
      </div>,
    )
  })

  it('should render email body correctly', () => {
    expect(wrapper).toMatchSnapshot()
    expect(expander).toMatchSnapshot()
  })
})
