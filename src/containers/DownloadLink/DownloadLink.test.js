
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import React from 'react'
import { ResponseType } from '@/enums/ResponseType'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { apiRequest } from '@/utils/apiRequest'
import { notifyWarning } from '@/utils/notification'
import { DownloadLink } from './DownloadLink'
import { Link } from './DownloadLink.styles'

const mockErrorNotFound = {
  response: {
    status: StatusCode.NOT_FOUND,
  },
}

const mockErrorConflict = {
  response: {
    status: StatusCode.CONFLICT,
  },
}

jest.mock('@/utils/apiRequest')
jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
}))
jest.mock('react', () => mockReact({
  mockUseRef: () => ({
    current: {
      href: '',
      click: jest.fn(),
      removeAttribute: jest.fn(),
    },
  }),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Container: DownloadLink', () => {
  let defaultProps
  let wrapper
  URL.createObjectURL = jest.fn()
  URL.revokeObjectURL = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    defaultProps = {
      children: <div />,
      fileName: 'mockFileName',
      apiUrl: 'mockApiUrl',
      disabled: false,
    }

    wrapper = shallow(<DownloadLink {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call notifyWarning with correct error text in case apiRequest.get is rejected with error 404', async () => {
    apiRequest.get.mockImplementation(() => Promise.reject(mockErrorNotFound))

    await wrapper.find(Link).props().onClick()
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DOWNLOAD_FAILURE_404))
  })

  it('should call notifyWarning with correct error text in case apiRequest.get is rejected with error other that 404', async () => {
    apiRequest.get.mockImplementation(() => Promise.reject(mockErrorConflict))

    await wrapper.find(Link).props().onClick()
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DOWNLOAD_FAILURE))
  })

  it('should call apiRequest.get with correct params if the download link href is not yet created', () => {
    const MockRequestConfig = {
      responseType: ResponseType.BLOB,
    }

    wrapper.find(Link).props().onClick()
    expect(apiRequest.get).nthCalledWith(1, defaultProps.apiUrl, MockRequestConfig)
  })

  it('should not call apiRequest.get if download link is disabled', () => {
    defaultProps.disabled = true

    wrapper.setProps(defaultProps)
    wrapper.find(Link).props().onClick()

    expect(apiRequest.get).not.toHaveBeenCalled()
  })

  it('should not call apiRequest.get if the download link href is already created', () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: {
        href: 'hrefMock',
      },
    })

    wrapper = shallow(<DownloadLink {...defaultProps} />)
    wrapper.find(Link).props().onClick()
    expect(apiRequest.get).not.toBeCalled()
  })

  it('should call getBlob in case there is getBlob prop', () => {
    const getBlobMock = jest.fn()
    defaultProps = {
      ...defaultProps,
      getBlob: getBlobMock,
    }

    wrapper = shallow(<DownloadLink {...defaultProps} />)
    wrapper.find(Link).props().onClick()
    expect(getBlobMock).nthCalledWith(1)
  })
})
