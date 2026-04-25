
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { shallow } from 'enzyme'
import React from 'react'
import { deleteDocumentOutput } from '@/api/outputProfilesApi'
import { Localization, localize } from '@/localization/i18n'
import { apiMap } from '@/utils/apiMap'
import { OutputCommandBar } from './OutputCommandBar'
import { CommandBar } from './OutputCommandBar.styles'

const mockResult = {
  isLoading: false,
  downloadOutput: jest.fn(),
}

const mockFilePath = 'filepath.js'
const mockName = 'name'
const mockDocumentId = 'id'
const mockOutputId = 'outputId'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/hooks/useDownload', () => ({
  useDownload: jest.fn(() => mockResult),
}))

jest.mock('@/api/outputProfilesApi', () => ({
  deleteDocumentOutput: jest.fn(),
}))

describe('Container: OutputCommandBar', () => {
  let defaultProps
  let wrapper

  const getCommandBarCommands = (wrapper) => (
    wrapper.find(CommandBar).props().commands
  )

  beforeEach(() => {
    defaultProps = {
      isPending: false,
      filePath: mockFilePath,
      name: mockName,
      documentId: mockDocumentId,
      outputId: mockOutputId,
      reloadData: jest.fn(),
    }

    wrapper = shallow(<OutputCommandBar {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render commands correctly', () => {
    const commands = getCommandBarCommands(wrapper)

    commands.forEach((c) => {
      expect(<div>{c.renderComponent()}</div>).toMatchSnapshot()
    })
  })

  it('should call downloadOutput when click on download button', () => {
    const commands = getCommandBarCommands(wrapper)
    commands[1].renderComponent().props.onClick()

    expect(mockResult.downloadOutput).nthCalledWith(
      1,
      apiMap.fileStorage.v1.file.output(mockFilePath),
      `${mockName}.js`,
    )
  })

  it('should call deleteDocumentOutput when click on delete button', () => {
    const commands = getCommandBarCommands(wrapper)
    commands[0].renderComponent().props.onClick()

    expect(deleteDocumentOutput).nthCalledWith(
      1,
      mockDocumentId,
      mockOutputId,
    )
  })

  it('should call reloadData if output was deleted', async () => {
    const commands = getCommandBarCommands(wrapper)
    await commands[0].renderComponent().props.onClick()

    expect(defaultProps.reloadData).toHaveBeenCalled()
  })

  it('should call notifySuccess with correct message when output was deleted', async () => {
    const commands = getCommandBarCommands(wrapper)
    await commands[0].renderComponent().props.onClick()

    expect(mockNotification.notifySuccess).nthCalledWith(
      1, localize(Localization.DELETE_OUTPUT_SUCCESS_STATUS),
    )
  })

  it('should call notifyWarning with correct message when output was not deleted', async () => {
    deleteDocumentOutput.mockImplementationOnce(() => Promise.reject(new Error('')))
    const commands = getCommandBarCommands(wrapper)
    await commands[0].renderComponent().props.onClick()

    expect(mockNotification.notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })
})
