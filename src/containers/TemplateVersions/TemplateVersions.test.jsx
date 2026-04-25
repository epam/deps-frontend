
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import {
  fetchTemplateVersions,
  updateTemplateVersionName,
  fetchTemplateMarkupState,
} from '@/api/templatesApi'
import { ASYNC_OPERATION_STATE } from '@/enums/AsyncOperationState'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { TemplateVersion } from '@/models/TemplateVersion'
import { navigationMap } from '@/utils/navigationMap'
import {
  notifyWarning,
  notifyInfo,
  notifyProgress,
} from '@/utils/notification'
import { goTo } from '@/utils/routerActions'
import { stringsSorter } from '@/utils/string'
import { TemplateVersions } from './TemplateVersions'

const mockTemplateId = '1'
const mockNewName = 'newName'

const mockVersions = [
  new TemplateVersion({
    id: mockTemplateId,
    name: 'test',
    createdAt: '2023-04-21',
    templateId: 'templateID',
  }),
]

jest.mock('@/selectors/requests')
jest.mock('@/containers/TemplateNavHeader', () => mockComponent('TemplateNavHeader'))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/string', () => ({
  stringsSorter: jest.fn(),
}))
jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    id: mockTemplateId,
  })),
}))
jest.mock('@/hocs/withParentSize', () => ({
  withParentSize: () => (Component) => Component,
}))

jest.mock('react', () => mockReact({
  mockUseState: jest
    .fn((state) => {
      const setState = jest.fn((changes) => {
        state = changes
      })

      return [state, setState]
    })
    .mockImplementationOnce(() => [mockVersions, jest.fn()]),
}))

jest.mock('@/actions/navigation', () => ({
  setSelection: jest.fn(),
}))

jest.mock('@/api/templatesApi', () => ({
  fetchTemplateVersions: jest.fn(() => Promise.resolve(mockVersions)),
  updateTemplateVersionName: jest.fn(),
  fetchTemplateMarkupState: jest.fn(),
}))

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
  notifyProgress: jest.fn(() => jest.fn()),
  notifyInfo: jest.fn(),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/containers/TemplateVersions/TemplateVersionsRowCommands', () => ({
  TemplateVersionsRowCommands: () =>
    mockComponent('TemplateVersionsRowCommands'),
}))

describe('Container: TemplateVersions', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TemplateVersions />)
  })

  it('should render correctly with templates versions', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly without data', () => {
    useState.mockImplementationOnce(() => [[], jest.fn()])
    wrapper = shallow(<TemplateVersions />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should call fetchTemplateVersions with correct argument', () => {
    expect(fetchTemplateVersions).nthCalledWith(1, mockTemplateId)
  })

  it('should not call fetchTemplateVersions if templateId is null', () => {
    jest.clearAllMocks()

    useParams.mockImplementationOnce(() => ({ id: null }))
    wrapper = shallow(<TemplateVersions />)

    expect(fetchTemplateVersions).not.toHaveBeenCalled()
  })

  it('should call notifyWarning if fetchTemplateVersions finished with error', async () => {
    jest.clearAllMocks()
    fetchTemplateVersions.mockImplementationOnce(() => Promise.reject(new Error('test')))

    wrapper = shallow(<TemplateVersions />)

    expect(await notifyWarning).toHaveBeenCalled()
  })

  it('should correctly render column titles', () => {
    wrapper.childAt(1).props().columns.forEach((c) => {
      expect(<div>{c.title}</div>).toMatchSnapshot()
    })
  })

  it('should correctly render columns items for version', () => {
    wrapper.childAt(1).props().columns.forEach(({ dataIndex, render }) => {
      mockVersions.forEach((version) => {
        const column = shallow(<div>{render(version[dataIndex], version)}</div>)
        expect(column).toMatchSnapshot()
      })
    })
  })

  it('should call goTo with correct args if fetchTemplateVersions finished with 404 error', async () => {
    jest.clearAllMocks()
    const error = new Error('test')
    error.response = {
      status: StatusCode.NOT_FOUND,
    }

    fetchTemplateVersions.mockImplementationOnce(() => Promise.reject(error))

    wrapper = shallow(<TemplateVersions />)

    expect(await goTo).nthCalledWith(1, navigationMap.error.notFound())
  })

  it('should call stringSorter when call sorter method in column', () => {
    const versions = [
      ...mockVersions,
      new TemplateVersion({
        id: '2',
        name: 'test2',
        createdAt: '2023-04-21',
        templateId: 'templateID',
      }),
    ]

    wrapper.childAt(1).props().columns.forEach((c) => {
      if (c?.sorter) {
        c?.sorter(versions[0], versions[1])

        expect(stringsSorter).toHaveBeenCalled()
      }
    })
  })

  it('should call updateTemplateVersionName when call updateVersionName in TemplateVersionTitle', async () => {
    const [version] = mockVersions
    const templateVersionTitleColumn = wrapper.childAt(1).props().columns.find(
      (c) => c.title === localize(Localization.TITLE),
    )
    const TemplateVersionTitle = shallow(
      <div>{templateVersionTitleColumn.render(version.name, version)}</div>,
    )

    await TemplateVersionTitle.props().children.props.updateVersionName(mockNewName, version)

    expect(updateTemplateVersionName).nthCalledWith(
      1,
      mockTemplateId,
      {
        id: version.id,
        name: mockNewName,
      },
    )
  })

  it('should not call updateTemplateVersionName if new version name is equal to default version name', async () => {
    jest.clearAllMocks()

    const [version] = mockVersions
    const templateVersionTitleColumn = wrapper.childAt(1).props().columns.find(
      (c) => c.title === localize(Localization.TITLE),
    )
    const TemplateVersionTitle = shallow(
      <div>{templateVersionTitleColumn.render(version.name, version)}</div>,
    )

    await TemplateVersionTitle.props().children.props.updateVersionName(version.name, version)

    expect(updateTemplateVersionName).not.toHaveBeenCalled()
  })

  it('should call notifyWarning if catch an error when call updateVersionName in TemplateVersionTitle', async () => {
    updateTemplateVersionName.mockImplementationOnce(() => Promise.reject(new Error('test')))

    const [version] = mockVersions
    const templateVersionTitleColumn = wrapper.childAt(1).props().columns.find(
      (c) => c.title === localize(Localization.TITLE),
    )
    const TemplateVersionTitle = shallow(
      <div>{templateVersionTitleColumn.render(version.name, version)}</div>,
    )

    await TemplateVersionTitle.props().children.props.updateVersionName(mockNewName, version)

    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })

  it('should call notifyProgress with correct args when TemplateVersion is clicked', async () => {
    const mockEvent = {
      target: 'mockTarget',
    }

    const mockRowConfig = {
      id: 'mockId',
    }

    await wrapper.childAt(1).props().onRow(mockRowConfig).onClick(mockEvent)
    expect(notifyProgress).nthCalledWith(1, localize(Localization.AUTO_MARKUP_CHECKING))
  })

  it('should call stopNotifyProgress function when TemplateVersion is clicked', async () => {
    const mockEvent = {
      target: 'mockTarget',
    }

    const mockRowConfig = {
      id: 'mockId',
    }

    const mockStopFunction = jest.fn()
    notifyProgress.mockImplementationOnce(() => mockStopFunction)

    await wrapper.childAt(1).props().onRow(mockRowConfig).onClick(mockEvent)
    expect(mockStopFunction).toHaveBeenCalled()
  })

  it('should not call notifyInfo in case of autoLabeling pipeline status is not processing', async () => {
    fetchTemplateMarkupState.mockImplementationOnce(() => Promise.resolve(ASYNC_OPERATION_STATE.NONE))

    const mockEvent = {
      target: 'mockTarget',
    }

    const mockRowConfig = {
      id: 'mockId',
    }

    await wrapper.childAt(1).props().onRow(mockRowConfig).onClick(mockEvent)
    expect(notifyInfo).not.toBeCalled()
  })

  it('should call notifyInfo in case of pipeline status is processing', async () => {
    fetchTemplateMarkupState.mockImplementationOnce(() => Promise.resolve(ASYNC_OPERATION_STATE.PROCESSING))

    const mockEvent = {
      target: 'mockTarget',
    }

    const mockRowConfig = {
      id: 'mockId',
    }

    await wrapper.childAt(1).props().onRow(mockRowConfig).onClick(mockEvent)
    expect(notifyInfo).nthCalledWith(1, localize(Localization.AUTO_MARKUP_IN_PROGRESS))
  })
})
