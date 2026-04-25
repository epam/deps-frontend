
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ComponentSize } from '@/enums/ComponentSize'
import { DocumentFileUploadItem } from '../DocumentFileUploadItem'
import { DocumentFileUploadList } from '../DocumentFileUploadList'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: DocumentFileUploadList', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      size: ComponentSize.SMALL,
      files: [
        { uid: 'test1' },
        { uid: 'test2' },
      ],
      documentUploadState: {
        files: {
          test1: 100,
          test2: 90,
        },
        status: 'PENDING',
      },
      document: {
        uid: 'test1',
        name: '2020-02-04T15:08:18+03:00 - test1.pdf',
        files: [
          { uid: 'test1' },
          { uid: 'test2' },
        ],
      },
      deleteFile: jest.fn(),
      uploading: false,
    }
    wrapper = shallow(<DocumentFileUploadList {...defaultProps} />)
  })

  it('should render List with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render DocumentFileUploadItem with correct props', () => {
    expect(wrapper.props().renderItem(defaultProps.files[0])).toMatchSnapshot()
  })

  it('should pass correct deleteFile callback to DocumentFileUploadItem as delete prop', () => {
    const renderItem = shallow(
      <div>
        {wrapper.props().renderItem(defaultProps.files[0])}
      </div>,
    )
    expect(renderItem.find(DocumentFileUploadItem).props().deleteFile).toEqual(defaultProps.deleteFile)
  })
})
