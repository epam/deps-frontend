
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { FieldValidation } from '@/models/DocumentValidation'
import {
  ExtractedDataField,
  FieldData,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { documentSelector } from '@/selectors/documentReviewPage'
import { FieldAdapter } from './FieldAdapter'

const mockUser = new User(
  'system@email.com',
  'Test',
  'Tester',
  new Organisation('1111', 'TestOrganisation', 'http://host/customization.js'),
  'SystemUser',
  '1111-1111-1111',
)

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/authorization')
jest.mock('./useFieldProps', () => ({
  useFieldProps: jest.fn(() => ({
    onChangeData: jest.fn(),
    onFocus: jest.fn(),
    setHighlightedField: jest.fn(),
    revertValue: jest.fn(),
    isRevertDisabled: false,
  })),
}))
jest.mock('./KeyValuePairEdField', () => mockComponent('KeyValuePairEdField'))
jest.mock('./ListEdField', () => mockComponent('ListEdField'))
jest.mock('./TableEdField', () => mockComponent('TableEdField'))
jest.mock('@/containers/InView', () => ({
  getSeparatedId: jest.fn(() => 'TestId'),
}))

const { ConnectedComponent } = FieldAdapter

describe('Containers: FieldAdapter', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      active: true,
      user: mockUser,
      activePage: 1,
      disabled: false,
      edField: new ExtractedDataField(
        1,
        new FieldData(350, new FieldCoordinates(2, 0.19, 0.26, 0.80, 0.5), 0.69),
      ),
      dtField: new DocumentTypeField(
        'verticalReference',
        'Vertical Reference',
        new DocumentTypeFieldMeta('BC', 'A'),
        FieldType.STRING,
        false,
        1,
        'mockDocumentTypeCode',
        1,
      ),
      highlightPolygonCoordsField: jest.fn(),
      highlightTableCoordsField: jest.fn(),
      highlightTextCoordsField: jest.fn(),
      customization: {
        Field: {
          getUrl: jest.fn(() => 'mockUrl'),
        },
      },
      updateExtractedData: jest.fn(),
      documentId: 'mockId',
      document: {
        ...documentSelector.getSelectorMockValue(),
        initialDocumentData: documentSelector.getSelectorMockValue().extractedData,
      },
      validation: new FieldValidation(
        [
          {
            column: 1,
            row: 1,
            index: null,
            message: 'MockError',
          },
        ],
        [
          {
            column: 0,
            row: 0,
            index: null,
            message: 'MockWarning',
          },
        ],
      ),
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly in case of no customization', () => {
    defaultProps.customization = {}
    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout for local error boundary', () => {
    const error = wrapper.find(ErrorBoundary).first().props().localBoundary()
    expect(error).toMatchSnapshot()
  })
})
