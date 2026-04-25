
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { fetchDocumentsByFilter } from '@/actions/documentsListPage'
import { Spin } from '@/components/Spin'
import { documentsTotalSelector } from '@/selectors/documentsListPage'
import { areDocumentsFetchingSelector } from '@/selectors/requests'
import { navigationMap } from '@/utils/navigationMap'
import { openInNewTarget } from '@/utils/window'
import { Card } from '../Card'
import { DocumentsCard } from '.'

const mockActions = {
  fetchDocumentsByFilter: 'fetchDocumentsByFilter',
}

const mockDispatch = jest.fn((action) => action)

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentsListPage')
jest.mock('@/selectors/requests')

jest.mock('@/actions/documentsListPage', () => ({
  fetchDocumentsByFilter: jest.fn(() => mockActions.fetchDocumentsByFilter),
}))

jest.mock('@/utils/window', () => ({
  openInNewTarget: jest.fn(),
}))

describe('Container: DocumentsCard', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DocumentsCard />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call to documentsTotalSelector', () => {
    expect(documentsTotalSelector).nthCalledWith(1)
  })

  it('should call to areDocumentsFetchingSelector', () => {
    expect(areDocumentsFetchingSelector).nthCalledWith(1)
  })

  it('should call dispatch with fetchDocumentsByFilter action when component mount', () => {
    expect(mockDispatch).nthCalledWith(2, fetchDocumentsByFilter())
  })

  it('should render Spin if documents are fetching', () => {
    areDocumentsFetchingSelector.mockImplementationOnce(() => true)

    wrapper = shallow(<DocumentsCard />)

    expect(wrapper.find(Spin).exists()).toEqual(true)
  })

  it('should call openInNewTarget function with correct arguments after click on the card', () => {
    const mockEvent = {
      target: {
        value: 'mockValue',
      },
    }

    const CardComponent = wrapper.find(Card)
    CardComponent.props().onClick(mockEvent)

    expect(openInNewTarget).nthCalledWith(
      1,
      mockEvent,
      navigationMap.documents(),
      expect.any(Function),
    )
  })
})
