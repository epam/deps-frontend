
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { addComment } from '@/actions/documentReviewPage'
import { getUser } from '@/api/iamApi'
import { Button } from '@/components/Button'
import { Comment } from '@/models/Comment'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import {
  idSelector,
  documentSelector,
} from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { DocumentComments } from './DocumentComments'

const mockUser = new User(
  'system@email.com',
  'Test',
  'Tester',
  new Organisation('1111', 'TestOrganisation'),
  'SystemUser',
)

const mockUserUid = 'mockUserUid'
jest.mock('@/api/iamApi', () => ({
  getUser: jest.fn(() => ({ [mockUserUid]: mockUser })),
}))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/actions/documentReviewPage', () => ({
  addComment: jest.fn(),
}))
jest.mock('@/actions/navigation', () => ({
  setUi: jest.fn(),
}))
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/dayjs', () => ({
  toLocalizedDateString: jest.fn(() => '10.10.2020'),
}))
jest.mock('@/utils/env', () => mockEnv)

const { mapStateToProps, mapDispatchToProps, ConnectedComponent } = DocumentComments

jest.mock('@/utils/notification', () => mockNotification)

const mockErrorMessage = 'Mock Error Message'
const mockError = new Error(mockErrorMessage)

describe('Container: DocumentComments', () => {
  describe('mapStateToProps', () => {
    it('should call to idSelector with state and pass the result as id prop', () => {
      const { props } = mapStateToProps()

      expect(idSelector).toHaveBeenCalled()
      expect(props.id).toEqual(idSelector.getSelectorMockValue())
    })

    it('should call to documentSelector with state and pass the result as document prop', () => {
      const { props } = mapStateToProps()

      expect(documentSelector).toHaveBeenCalled()
      expect(props.document).toEqual(documentSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should dispatch addComment action', () => {
      const { props } = mapDispatchToProps()
      props.addComment()
      expect(addComment).toHaveBeenCalled()
    })
  })

  describe('as connected component', () => {
    let defaultProps
    let wrapper

    const commentResponse = new Comment(
      'hello comment text',
      mockUserUid,
      '2018-09-03T09:34:24.249',
    )

    beforeEach(() => {
      defaultProps = {
        id: 'id',
        document: documentSelector.getSelectorMockValue(),
        addComment: jest.fn(() => Promise.resolve(commentResponse)),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call props addComment when calling to button onClick', async () => {
      const comment = 'hello world'

      wrapper.setState({
        comment,
        fetching: false,
        users: null,
      })
      await wrapper.instance().createComment()
      const buttonProps = wrapper.find(Button).props()
      await buttonProps.onClick()
      expect(defaultProps.addComment).nthCalledWith(1, defaultProps.id, comment)
    })

    it('should call notifyRequest in case of calling to button onClick', async () => {
      const buttonProps = wrapper.find(Button).props()
      await buttonProps.onClick()
      expect(mockNotification.notifyProgress).nthCalledWith(1, 'Adding comment')
    })

    it('should call success with correct message in case of calling button onClick ', async () => {
      const buttonProps = wrapper.find(Button).props()
      await buttonProps.onClick()
      expect(mockNotification.notifySuccess).nthCalledWith(1, 'Comment added')
    })

    it('should call warning with correct message in case of addComment rejection  when calling to button onClick', async () => {
      defaultProps.addComment.mockImplementationOnce(() =>
        Promise.reject(mockError),
      )
      try {
        const buttonProps = wrapper.find(Button).props()
        await buttonProps.onClick()
        expect(mockNotification.notifyWarning).nthCalledWith(1, 'Failed to add comment')
      } catch (err) {
        expect(err.message).toBe(mockErrorMessage)
      }
    })

    it('should call getUser with correct userId when component mounted', () => {
      expect(getUser).nthCalledWith(1, defaultProps.document.communication.comments[0].createdBy)
    })

    it('should call getUser with correct user id in case of calling to button onClick', async () => {
      jest.clearAllMocks()
      const buttonProps = wrapper.find(Button).props()
      await buttonProps.onClick()
      expect(getUser).nthCalledWith(1, commentResponse.createdBy)
    })

    it('should not call getUser in case of addComment returns empty createdBy when calling to button onClick', async () => {
      jest.clearAllMocks()
      defaultProps.addComment.mockImplementationOnce(() => ({
        ...commentResponse,
        createdBy: null,
      }))
      const buttonProps = wrapper.find(Button).props()
      await buttonProps.onClick()
      expect(getUser).not.toHaveBeenCalled()
    })

    it('should call notifyWarning with correct message in case of getUser rejection when component is mounted', async () => {
      jest.clearAllMocks()
      getUser.mockImplementationOnce(() => Promise.reject(mockError))
      shallow(<ConnectedComponent {...defaultProps} />)
      await flushPromises()
      expect(notifyWarning).nthCalledWith(1, 'Users\' data cannot be retrieved')
    })

    it('should call notifyWarning with correct message in case of getUser rejection when calling to button onCLick', async () => {
      jest.clearAllMocks()
      getUser.mockImplementationOnce(() => Promise.reject(mockError))
      const buttonProps = wrapper.find(Button).props()
      await buttonProps.onClick()
      expect(notifyWarning).nthCalledWith(1, 'Users\' data cannot be retrieved')
    })
  })
})
