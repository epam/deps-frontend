
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { deleteDocuments } from '@/actions/documents'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { DeleteDocumentButton } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/documents', () => ({
  deleteDocuments: jest.fn(() => Promise.resolve()),
}))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

const { ConnectedComponent, mapDispatchToProps } = DeleteDocumentButton

describe('Container: DeleteDocumentButton', () => {
  describe('mergeProps', () => {
    it('should dispatch deleteDocument action', async () => {
      const ownProps = {
        documentId: 'Id',
      }

      const { props } = mapDispatchToProps(undefined, ownProps)
      await props.deleteDocument()
      expect(goTo).nthCalledWith(1, navigationMap.documents())
      expect(deleteDocuments).toHaveBeenCalledTimes(1)
    })
  })

  describe('connected Component', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        children: 'Delete',
        deleteDocument: jest.fn(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
