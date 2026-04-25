
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { changeFieldsGrouping } from '@/actions/documentReviewPage'
import { GROUPING_TYPE } from '@/enums/GroupingTypeTabs'
import { useCustomization } from '@/hooks/useCustomization'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { documentTypeSelector } from '@/selectors/documentReviewPage'
import { useCustomFieldsGrouping } from './useCustomFieldsGrouping'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/documentReviewPage', () => ({
  changeFieldsGrouping: jest.fn(),
}))
jest.mock('@/hooks/useCustomization', () => ({
  useCustomization: jest.fn(() => ({
    module: jest.fn(),
  })),
}))
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/customization')
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/env', () => mockEnv)

const MockComponent = () => {
  useCustomFieldsGrouping()
  return null
}

describe('Hook: useCustomFieldsGrouping', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    shallow(<MockComponent />)
  })

  it('should call userSelector', () => {
    expect(userSelector).toHaveBeenCalled()
  })

  it('should call customizationSelector', () => {
    expect(customizationSelector).toHaveBeenCalled()
  })

  it('should call documentTypeSelector', () => {
    expect(documentTypeSelector).toHaveBeenCalled()
  })

  it('should call useCustomization first time with expected url', () => {
    jest.clearAllMocks()
    const expectedUrl = 'url'
    customizationSelector.mockImplementationOnce(() => ({
      ApplyFieldsGrouping: {
        getUrl: jest.fn(() => expectedUrl),
      },
    }))

    shallow(<MockComponent />)

    expect(useCustomization).toHaveBeenNthCalledWith(1, expectedUrl)
  })

  it('should call customization function with correct arg', () => {
    const customFunction = jest.fn()
    useCustomization.mockImplementation(jest.fn(() => ({
      module: customFunction,
    })))

    const expectedConfig = {
      possibleGroupTypes: GROUPING_TYPE,
      documentTypeCode: documentTypeSelector.getSelectorMockValue().code,
    }

    shallow(<MockComponent />)

    expect(customFunction).nthCalledWith(1, expectedConfig)
  })

  it('should call changeFieldsGrouping action, if custom fieldsGrouping is one of supported by grouping types', () => {
    const customFunction = jest.fn(() => GROUPING_TYPE.BY_PAGE)
    useCustomization.mockImplementation(jest.fn(() => ({
      module: customFunction,
    })))

    shallow(<MockComponent />)

    expect(changeFieldsGrouping).toHaveBeenCalledWith(GROUPING_TYPE.BY_PAGE)
  })

  it('should not call changeFieldsGrouping action, if custom fieldsGrouping is not supported', () => {
    const mockGroupingType = 'mockType'

    const customFunction = jest.fn(() => mockGroupingType)
    useCustomization.mockImplementation(jest.fn(() => ({
      module: customFunction,
    })))

    shallow(<MockComponent />)

    expect(changeFieldsGrouping).not.toBeCalledWith(mockGroupingType)
  })

  it('should not call changeFieldsGrouping action, of customization are not supports custom grouping', () => {
    useCustomization.mockImplementation(jest.fn(() => ({
      module: null,
    })))

    shallow(<MockComponent />)

    expect(changeFieldsGrouping).not.toBeCalled()
  })

  it('should call useCustomization with correct url, from user', () => {
    const mockUser = {
      defaultCustomizationUrl: 'userUrl',
      organisation: {},
    }

    customizationSelector.mockImplementationOnce(() => ({
      ApplyFieldsGrouping: {
        getUrl: jest.fn((url) => url),
      },
    }))

    userSelector.mockImplementationOnce(() => mockUser)

    shallow(<MockComponent />)

    expect(useCustomization).toBeCalledWith(mockUser.defaultCustomizationUrl)
  })

  it('should call useCustomization with correct url, from user\'s organization', () => {
    const mockUser = {
      defaultCustomizationUrl: '',
      organisation: {
        customizationUrl: 'organizationUrl',
      },
    }

    customizationSelector.mockImplementationOnce(() => ({
      ApplyFieldsGrouping: {
        getUrl: jest.fn((url) => url),
      },
    }))

    userSelector.mockImplementationOnce(() => mockUser)

    shallow(<MockComponent />)

    expect(useCustomization).toBeCalledWith(mockUser.organisation.customizationUrl)
  })

  it('should call useCustomization with user\'s organization, if both are present', () => {
    const mockUser = {
      defaultCustomizationUrl: 'userUrl',
      organisation: {
        customizationUrl: 'organizationUrl',
      },
    }

    customizationSelector.mockImplementationOnce(() => ({
      ApplyFieldsGrouping: {
        getUrl: jest.fn((url) => url),
      },
    }))

    userSelector.mockImplementationOnce(() => mockUser)

    shallow(<MockComponent />)

    expect(useCustomization).toBeCalledWith(mockUser.organisation.customizationUrl)
  })
})
