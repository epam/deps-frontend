
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Expander } from '@/components/Expander'
import { ContainerType } from '@/enums/ContainerType'
import { documentSelector } from '@/selectors/documentReviewPage'
import { EmailInfo } from './EmailInfo'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/selectors/documentReviewPage')

const { ConnectedComponent } = EmailInfo

describe('Component: EmailInfo', () => {
  let wrapper
  let defaultProps
  let expander

  beforeEach(() => {
    defaultProps = {
      document: {
        ...documentSelector.getSelectorMockValue(),
        containerType: ContainerType.EMAIL,
        containerMetadata: {
          body: '<p>test</p>',
          recipients: ['First_user@randomUser.com', 'Second_user@anyUser.com'],
          cc: ['Some_Secondary_recipient@email.com'],
          date: '30 February 1999',
          sender: 'Sender@mail.com',
          subject: 'Subject line matters',
        },
      },
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    expander = shallow(
      <div>
        {wrapper.find(Expander).props().children(false, jest.fn())}
      </div>,
    )
  })

  it('should render correct layout according to props', () => {
    expect(expander).toMatchSnapshot()
    expect(wrapper).toMatchSnapshot()
  })
})
