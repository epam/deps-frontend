
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { getDocumentError } from '@/actions/documentReviewPage'
import { DocumentState } from '@/enums/DocumentState'
import { Document } from '@/models/Document'
import { Label } from '@/models/Label'
import { PreviewEntity } from '@/models/PreviewEntity'
import { DocumentViewHeader } from './DocumentViewHeader'
import { LongLabelsList } from './DocumentViewHeader.styles'
import { ErrorMessage } from './ErrorMessage'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DocumentReviewControls', () => mockComponent('DocumentReviewControls'))
jest.mock('@/containers/PdfSplitting', () => mockComponent('PdfSplittingButton'))
jest.mock('@/containers/DocumentNavigationButton', () => mockComponent('DocumentNavigationButton'))

jest.mock('@/actions/documentReviewPage', () => ({
  getDocumentError: jest.fn(),
}))

const mockDocumentWithoutLabels = new Document({
  id: 'mockId',
  documentType: new PreviewEntity(),
  state: DocumentState.IN_REVIEW,
})

const mockDocumentWithLabels = new Document({
  id: 'mockId',
  documentType: new PreviewEntity(),
  labels: [new Label('id', 'name')],
  state: DocumentState.IN_REVIEW,
})

const mockFailedDocument = new Document({
  id: 'mockId',
  documentType: new PreviewEntity(),
  state: DocumentState.FAILED,
  error: {
    description: 'mockDescription',
    inState: DocumentState.PREPROCESSING,
  },
})

describe('Component: DocumentViewHeader', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      titleComponent: <div>mockTitleComponent</div>,
      document: mockDocumentWithoutLabels,
    }

    wrapper = shallow(<DocumentViewHeader {...defaultProps} />)
  })

  it('should render correct layout according to props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render labels tags when document has labels', () => {
    wrapper.setProps({
      ...defaultProps,
      document: mockDocumentWithLabels,
    })

    expect(wrapper.find(LongLabelsList).exists()).toBe(true)
  })

  it('should render error message when document has failed state', () => {
    wrapper.setProps({
      ...defaultProps,
      document: mockFailedDocument,
    })

    expect(wrapper.find(ErrorMessage).exists()).toBe(true)
  })

  it('should call getDocumentError if document has failed state and error is not passed', () => {
    wrapper.setProps({
      ...defaultProps,
      document: {
        ...mockFailedDocument,
        error: null,
      },
    })

    expect(getDocumentError).toHaveBeenCalled()
  })
})
