
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { GlobalSearch } from '@/containers/GlobalSearch'
import { TrialDrawerButton } from '@/containers/TrialDrawer'
import { UiEnvSettingsDrawer } from '@/containers/UiEnvSettingsDrawer'
import { UploadEntities } from '@/containers/UploadEntities'
import { pathNameSelector } from '@/selectors/router'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { ApplicationHeader } from './'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/containers/UserProfile', () => mockComponent('UserProfile'))
jest.mock('@/containers/UiEnvSettingsDrawer', () => mockComponent('UiEnvSettingsDrawer'))
jest.mock('@/containers/GlobalSearch', () => mockComponent('GlobalSearch'))
jest.mock('@/containers/UploadEntities', () => mockComponent('UploadEntities'))
jest.mock('@/selectors/router')
jest.mock('@/utils/env', () => mockEnv)

window.open = jest.fn()

const { mapStateToProps, ConnectedComponent } = ApplicationHeader

describe('Container: ApplicationHeader', () => {
  describe('mapStateToProps', () => {
    it('should call pathNameSelector and pass the result as pathName prop', () => {
      const { props } = mapStateToProps()

      expect(pathNameSelector).toHaveBeenCalled()
      expect(props.pathName).toEqual(pathNameSelector.getSelectorMockValue())
    })
  })

  describe('ConnectedComponent', () => {
    let defaultProps, wrapper

    beforeEach(() => {
      ENV.FEATURE_TRIAL_VERSION = true

      defaultProps = {
        pathName: navigationMap.documents(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render ApplicationHeader with correct props', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should not render GlobalSearch unless pathName includes navigationMap.documents()', () => {
      defaultProps.pathName = 'MOCK_URL'
      wrapper.setProps(defaultProps)
      expect(wrapper.find(GlobalSearch).exists()).toBeFalsy()
    })

    it('should not show TrialDrawerButton if FEATURE_TRIAL_VERSION is empty', () => {
      ENV.FEATURE_TRIAL_VERSION = false

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)

      const TrialButton = wrapper.find(TrialDrawerButton)

      expect(TrialButton.exists()).toBeFalsy()
    })

    it('should not render show UiEnvSettingsDrawer if FEATURE_UI_SETTINGS is false', () => {
      ENV.FEATURE_UI_SETTINGS = false

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)

      const uiSettings = wrapper.find(UiEnvSettingsDrawer)

      expect(uiSettings.exists()).toBe(false)
    })

    it('should render UploadEntities when FEATURE_ENTITIES_UPLOAD is true', () => {
      ENV.FEATURE_ENTITIES_UPLOAD = true

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)

      const uploadEntitiesButton = wrapper.find(UploadEntities)

      expect(uploadEntitiesButton.exists()).toBe(true)
    })

    it('should not render UploadEntities when FEATURE_ENTITIES_UPLOAD is false', () => {
      ENV.FEATURE_ENTITIES_UPLOAD = false

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)

      const uploadEntitiesButton = wrapper.find(UploadEntities)

      expect(uploadEntitiesButton.exists()).toBe(false)
    })
  })
})
