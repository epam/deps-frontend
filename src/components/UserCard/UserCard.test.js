
import { shallow } from 'enzyme'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { UserCard } from './UserCard'

describe('Container: UserCard', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      user: new User(
        'email',
        'firstName',
        'lastName',
        new Organisation('1111', 'TestOrganisation'),
        'username',
        'pk',
        'creationDate',
      ),
    }

    wrapper = shallow(<UserCard {...defaultProps} />)
  })

  it('should render the layout correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render the layout correctly without organisation, firstName and lastName', () => {
    defaultProps.user = new User(
      'email',
      null,
      null,
      null,
      'username',
      'pk',
    )

    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })
})
