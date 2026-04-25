
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { mockReactRouter } from '@/mocks/mockReactRouter'
import { shallow } from 'enzyme'
import React from 'react'
import { usePolling } from 'use-raf-polling'
import { DocumentState } from '@/enums/DocumentState'
import { DocumentsFilterConfig } from '@/models/DocumentsFilterConfig'
import { userSelector } from '@/selectors/authorization'
import { documentSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { DocumentsPage } from '.'

var mockAddEvent = jest.fn()

const { ConnectedComponent } = DocumentsPage

jest.mock('@/containers/DocumentsTable/DocumentsTableCommands', () => mockComponent('DocumentsTableCommands'))
jest.mock('@/containers/ManageLabelsModalButton', () => mockComponent('ManageLabelsModalButton'))
jest.mock('@/hooks/useEventSource', () => ({
  KnownBusinessEvent: {
    DOCUMENT_STATE_UPDATED: 'DocumentStateUpdated',
  },
  useEventSource: jest.fn(() => mockAddEvent),
}))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('react-router', () => mockReactRouter)
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/documentReviewPage')

jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    getDocuments: jest.fn(),
  },
}))
jest.mock('use-raf-polling', () => ({
  usePolling: jest.fn(() => ({
    isPolling: true,
    restartPolling: jest.fn(),
  })),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => ({
    pathname: '/documents',
    url: '/documents',
    search: '',
    state: '',
  }),
}))
jest.mock('@/utils/env', () => mockEnv)

const mockFilters = new DocumentsFilterConfig()

const SHOULD_REFETCH_DOCUMENT_STATES = [
  DocumentState.IDENTIFICATION,
  DocumentState.VERSION_IDENTIFICATION,
  DocumentState.DATA_EXTRACTION,
  DocumentState.NEW,
  DocumentState.UNIFICATION,
  DocumentState.IMAGE_PREPROCESSING,
  DocumentState.PREPROCESSING,
  DocumentState.VALIDATION,
  DocumentState.EXPORTING,
  DocumentState.PARSING,
]

describe('Container: DocumentsPage', () => {
  let defaultProps

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      columnsData: [],
      fetchTableColumns: jest.fn(),
      setPagination: jest.fn(),
      fetchDocumentsByFilter: jest.fn(),
      filters: mockFilters,
      total: 0,
      user: userSelector.getSelectorMockValue(),
      setStatesToDocuments: jest.fn(),
      documents: [documentSelector.getSelectorMockValue()],
    }
  })

  it('should render correct layout', () => {
    ENV.FEATURE_SERVER_SENT_EVENTS = false

    const wrapper = shallow(
      <ConnectedComponent {...defaultProps} />,
    )

    expect(wrapper).toMatchSnapshot()
  })

  Object.values(DocumentState).forEach((state) => {
    const shouldBeRefetched = SHOULD_REFETCH_DOCUMENT_STATES.includes(state)
    it(`should call usePolling with correct arguments if documents list contains document in state ${state} that should
    ${shouldBeRefetched ? '' : 'not '}be refetched`, () => {
      ENV.FEATURE_SERVER_SENT_EVENTS = false
      defaultProps.documents[0].state = state

      shallow(
        <ConnectedComponent {...defaultProps} />,
      )

      expect(usePolling).nthCalledWith(1, {
        callback: expect.any(Function),
        condition: shouldBeRefetched,
        interval: 2_000,
      })
    })
  })

  it('should call addEvent from useEventSource with correct arguments when container is mounted', () => {
    ENV.FEATURE_SERVER_SENT_EVENTS = true

    shallow(
      <ConnectedComponent {...defaultProps} />,
    )

    expect(mockAddEvent).nthCalledWith(1, 'DocumentStateUpdated', expect.any(Function))
  })
})
