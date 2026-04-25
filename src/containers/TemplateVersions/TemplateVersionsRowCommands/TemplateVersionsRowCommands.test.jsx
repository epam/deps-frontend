/* eslint-disable testing-library/no-render-in-setup */

import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { deleteTemplateVersion } from '@/api/templatesApi'
import { Modal } from '@/components/Modal'
import { notifyWarning } from '@/utils/notification'
import { TemplateVersionsRowCommands } from './TemplateVersionsRowCommands'
import { CommandBar } from './TemplateVersionsRowCommands.styles'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/api/templatesApi', () => ({
  deleteTemplateVersion: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
}))

const mockedEvent = {
  stopPropagation: jest.fn(),
}

const mockError = new Error('Mock Error Message')

const mockedTemplateId = 'mockedTemplateId'
const mockedVersionId = 'mockedVersionId'

describe('Container: TemplateVersionsRowCommands', () => {
  let wrapper,
    defaultProps,
    deleteButton,
    editButton

  beforeEach(() => {
    defaultProps = {
      templateId: mockedTemplateId,
      versionId: mockedVersionId,
      refreshTable: jest.fn(),
      setEditableVersionId: jest.fn(),
    }

    wrapper = shallow(<TemplateVersionsRowCommands {...defaultProps} />)
    const commands = wrapper.find(CommandBar).props().commands
    deleteButton = commands[1].renderComponent()
    editButton = commands[0].renderComponent()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render CommandBar commands correctly', () => {
    const commands = wrapper.find(CommandBar).props().commands

    expect(commands.map(({ renderComponent }) => renderComponent())).toMatchSnapshot()
  })

  it('should call stopPropagation when clicking on delete icon', async () => {
    await deleteButton.props.onClick(mockedEvent)
    expect(mockedEvent.stopPropagation).toBeCalledTimes(1)
  })

  it('should open Modal.confirm when clicking on delete icon', async () => {
    Modal.confirm = jest.fn()

    await deleteButton.props.onClick(mockedEvent)
    expect(Modal.confirm).toHaveBeenCalledTimes(1)
  })

  it('should call deleteTemplateVersion on delete confirmation', async () => {
    Modal.confirm = jest.fn((config) => config.onOk())

    await deleteButton.props.onClick(mockedEvent)
    expect(deleteTemplateVersion).nthCalledWith(1, mockedTemplateId, mockedVersionId)
  })

  it('should refresh table on delete confirmation', async () => {
    Modal.confirm = jest.fn((config) => config.onOk())

    await deleteButton.props.onClick(mockedEvent)
    expect(defaultProps.refreshTable).toHaveBeenCalledTimes(1)
  })

  it('should call notifyWarning when template versions was not deleted', async () => {
    Modal.confirm = jest.fn((config) => config.onOk())
    deleteTemplateVersion.mockImplementationOnce(() => Promise.reject(mockError))

    await deleteButton.props.onClick(mockedEvent)
    expect(notifyWarning).toHaveBeenCalledTimes(1)
  })

  it('should call setEditableVersionId when click on edit icon', () => {
    editButton.props.onClick(mockedEvent)

    expect(defaultProps.setEditableVersionId).nthCalledWith(1, mockedVersionId)
  })
})
