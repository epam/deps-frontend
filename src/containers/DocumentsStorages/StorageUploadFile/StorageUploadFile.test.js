
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { MimeType } from '@/enums/MimeType'
import { UploadStatus } from '@/enums/UploadStatus'
import { StorageFile } from '../models/StorageFile'
import { StorageUploadFile } from './StorageUploadFile'
import { ListItem } from './StorageUploadFile.styles'

const mockFile = new StorageFile({
  id: 'id',
  sizeBytes: 123,
  name: 'name.pdf',
  mimeType: MimeType.APPLICATION_PDF,
})

jest.mock('@/utils/env', () => mockEnv)

describe('Component: StorageUploadFile', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      file: mockFile,
      removeFile: jest.fn(),
    }

    wrapper = shallow(<StorageUploadFile {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call removeFile when click on remove button', () => {
    wrapper.find(ListItem).props().actions[0].props.onClick()

    expect(defaultProps.removeFile).nthCalledWith(1, mockFile.id)
  })

  it('should not render file actions if upload status is defined ', () => {
    defaultProps.uploadStatus = UploadStatus.PENDING

    wrapper = shallow(<StorageUploadFile {...defaultProps} />)

    expect(wrapper.find(ListItem).props().actions).toBeFalsy()
  })
})
