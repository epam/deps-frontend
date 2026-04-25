
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
  createTemplate,
  uploadTemplateVersionFile,
} from '@/api/templatesApi'
import { Button } from '@/components/Button'
import { TemplatePicker } from '@/containers/TemplatePicker'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { notifyError, notifySuccess } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'
import { CreateTemplateDrawer } from './CreateTemplateDrawer'
import { Drawer } from './CreateTemplateDrawer.styles'

jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('./CreateTemplateForm', () => mockComponent('CreateTemplateForm'))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

const deleteDocumentTypeUnwrappedFn = jest.fn(() => Promise.resolve())
const mockDeleteDocumentTypeFunction = jest.fn(() => ({
  unwrap: deleteDocumentTypeUnwrappedFn,
}))
jest.mock('@/apiRTK/documentTypeApi', () => ({
  useDeleteDocumentTypeMutation: jest.fn(() => [mockDeleteDocumentTypeFunction]),
}))

const mockResponse = { templateId: '1' }
const mockFile = {
  name: 'mockName',
  size: 1024,
}

jest.mock('@/api/templatesApi', () => ({
  createTemplate: jest.fn(() => Promise.resolve(mockResponse)),
  uploadTemplateVersionFile: jest.fn(() => Promise.resolve({})),
}))

const mockFormValues = {
  name: 'testName',
  code: 'testCode',
}

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    formState: {},
    getValues: jest.fn(() => mockFormValues),
  })),
}))

describe('Component: CreateTemplateButton', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallow(
      <CreateTemplateDrawer>MockedButtonText</CreateTemplateDrawer>,
    )
  })

  it('should render CreateTemplateButton with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should createTemplate on submit button click', async () => {
    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)
    await DrawerFooter.find(Button).props().onClick()

    expect(createTemplate).nthCalledWith(1, mockFormValues)
    expect(uploadTemplateVersionFile).nthCalledWith(
      1,
      {
        code: mockResponse.templateId,
        file: mockFile,
        name: mockFile.name,
      },
      null,
      expect.any(Function),
    )
  })

  it('should call createTemplate with correct arguments when template is created with duplicated fields', async () => {
    const mockFormValues = {
      name: 'testName',
      code: 'testCode',
      baseTemplateId: '32',
    }
    useForm.mockImplementationOnce(() => ({
      formState: {},
      getValues: jest.fn(() => mockFormValues),
    }))
    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)
    await DrawerFooter.find(Button).props().onClick()

    expect(createTemplate).nthCalledWith(1, mockFormValues)
  })

  it('should call success notification with correct message on successful template creation', async () => {
    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)
    await DrawerFooter.find(Button).props().onClick()

    expect(notifySuccess).nthCalledWith(1, localize(Localization.ALL_UPLOADS_SUCCESS_STATUS))
  })

  it('should call goTo with correct args on successful template creation', async () => {
    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)
    await DrawerFooter.find(Button).props().onClick()

    expect(goTo).nthCalledWith(
      1,
      navigationMap.documentTypes.documentType(mockResponse.templateId),
    )
  })

  it('should call error notification with correct message when create template failed', async () => {
    jest.clearAllMocks()
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)
    await DrawerFooter.find(Button).props().onClick()

    expect(notifyError).nthCalledWith(1, localize(Localization.ALL_TEMPLATE_UPLOADS_FAILURE_STATUS))
  })

  it('should call deleteDocumentType with correct argument when template uploading failed', async () => {
    const mockError = 'mockError'
    uploadTemplateVersionFile.mockImplementationOnce(() => Promise.reject(mockError))

    wrapper.find(TemplatePicker).props().setUploadedFile(mockFile)
    const Footer = wrapper.find(Drawer).props().footer
    const DrawerFooter = shallow(<div>{Footer}</div>)
    await DrawerFooter.find(Button).props().onClick()

    expect(mockDeleteDocumentTypeFunction).nthCalledWith(1, mockResponse.templateId)
  })
})
