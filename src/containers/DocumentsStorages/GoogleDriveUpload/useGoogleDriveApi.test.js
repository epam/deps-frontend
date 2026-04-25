
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { useDynamicScript } from '@/hooks/useDynamicScript'
import { ENV } from '@/utils/env'
import { Permission } from './Permission'
import { useGoogleDriveApi } from './useGoogleDriveApi'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react', () => mockReact())
jest.mock('@/hooks/useDynamicScript', () => ({
  useDynamicScript: jest.fn(() => ({
    ready: true,
  })),
}))

window.gapi = {
  load: jest.fn(),
  client: {
    init: jest.fn(),
    newBatch: jest.fn(() => ({
      add: jest.fn(),
      execute: jest.fn(),
    })),
    drive: {
      permissions: {
        create: jest.fn(),
      },
    },
  },
}

const Wrapper = () => (
  <div {...useGoogleDriveApi()} />
)

describe('Hook: useGoogleDriveApi', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Wrapper />)
  })

  it('should useDynamicScript to be called with correct url', () => {
    expect(useDynamicScript).nthCalledWith(1, 'https://apis.google.com/js/api.js')
  })

  it('should call window.gapi.load if gapi script is ready', () => {
    expect(window.gapi.load).nthCalledWith(1, 'client', expect.any(Function))
  })

  it('should not call window.gapi.load if gapi script is not ready', () => {
    jest.clearAllMocks()
    useDynamicScript.mockReturnValueOnce({
      return: false,
    })
    shallow(<Wrapper />)

    expect(window.gapi.load).not.toHaveBeenCalled()
  })

  it('should call create permission request with correct arguments', () => {
    const props = wrapper.props()
    const mockPermission = new Permission({
      role: 'reader',
      type: 'user',
      emailAddress: ENV.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
    })
    const mockFileId = 'mockId'
    const filesId = [mockFileId]
    props.sharePermission({
      filesId,
      permission: mockPermission,
    })

    expect(window.gapi.client.drive.permissions.create).nthCalledWith(filesId.length, {
      ...mockPermission,
      fileId: mockFileId,
      sendNotificationEmail: false,
    })
  })

  it('should return expected API', () => {
    const props = wrapper.props()

    expect(Object.keys(props)).toHaveLength(1)
    expect(props.sharePermission).toBeTruthy()
  })
})
