
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { TemplatePicker } from '@/containers/TemplatePicker'
import { localize, Localization } from '@/localization/i18n'
import { TemplateVersionUploadService } from '@/services/TemplateVersionUploadService'
import { notifySuccess, notifyError } from '@/utils/notification'
import { AddTemplateVersionButton } from './AddTemplateVersionButton'
import { Drawer } from './AddTemplateVersionButton.styles'

const mockFile = {
  name: 'mockName',
  size: 1024,
}
const mockTemplateId = 'mockId'
const mockFormValues = {
  description: 'testDescription',
}

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockFormValues),
  })),
}))

jest.mock('@/services/TemplateVersionUploadService', () => ({
  TemplateVersionUploadService: jest.fn((onFilesUploadSuccess, onFilesUploadError, onFilesUploadProgress) => ({
    uploadTemplateVersion: jest.fn((params) => {
      onFilesUploadProgress(mockFile, {})
      params.templateId ? onFilesUploadSuccess() : onFilesUploadError()
    }),
  })),
}))

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    id: mockTemplateId,
  })),
}))

describe('Component: AddTemplateVersionButton', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AddTemplateVersionButton />)
  })

  it('should render AddTemplateVersionButton', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Drawer in correct container', () => {
    const container = wrapper.find(Drawer).props().getContainer()

    expect(container).toEqual(document.body)
  })

  it('should call TemplateVersionUploadService on selecting files', async () => {
    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)

    await DrawerFooter.find(Button).props().onClick()

    expect(TemplateVersionUploadService).nthCalledWith(1, expect.any(Function), expect.any(Function), expect.any(Function))
  })

  it('should disable "Upload" button if file was not uploaded', () => {
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)

    expect(DrawerFooter.find(Button).props().disabled).toBe(true)
  })

  it('should call error notification with correct message on failed upload', async () => {
    useParams.mockReturnValueOnce({})
    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)

    await DrawerFooter.find(Button).props().onClick()

    expect(notifyError).nthCalledWith(1, localize(Localization.ALL_TEMPLATE_UPLOADS_FAILURE_STATUS))
  })

  it('should call success notification with correct message on successful upload', async () => {
    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)

    await DrawerFooter.find(Button).props().onClick()

    expect(notifySuccess).nthCalledWith(1, localize(Localization.ALL_UPLOADS_SUCCESS_STATUS))
  })

  it('should call uploadTemplateVersion with correct arguments on file upload', async () => {
    const uploadTemplateVersionMock = jest.fn()
    TemplateVersionUploadService.mockImplementation(() => ({
      uploadTemplateVersion: uploadTemplateVersionMock,
    }))
    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)

    await DrawerFooter.find(Button).props().onClick()

    expect(uploadTemplateVersionMock).toHaveBeenCalledWith({
      templateId: mockTemplateId,
      file: mockFile,
      name: mockFile.name,
      description: mockFormValues.description,
    })
  })
})
