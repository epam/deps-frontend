
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Button } from '@/components/Button'
import { localize, Localization } from '@/localization/i18n'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import { CopyInviteToClipboard } from './CopyInviteToClipboard'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/authorization')
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('react', () => mockReact())
jest.mock('@/utils/env', () => mockEnv)

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
  },
})

const { mapStateToProps, ConnectedComponent } = CopyInviteToClipboard

describe('Container: CopyInviteToClipboard', () => {
  describe('mapStateToProps', () => {
    it('should call userSelector and pass the result as user prop', () => {
      const { props } = mapStateToProps()

      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })
  })

  describe('ConnectedComponent', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        onClose: jest.fn(),
        user: userSelector.getSelectorMockValue(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call navigator.clipboard.writeText on copy click', async () => {
      const urlToCopy = window.location.origin + navigationMap.join() + `/${defaultProps.user.organisation.pk}`
      await wrapper.find(Button.Secondary).props().onClick()
      expect(navigator.clipboard.writeText).nthCalledWith(1, urlToCopy)
    })

    it('should call onClose on copy click', async () => {
      await wrapper.find(Button.Secondary).props().onClick()
      expect(defaultProps.onClose).toBeCalled()
    })

    it('should call notifySuccess on copy click', async () => {
      await wrapper.find(Button.Secondary).props().onClick()
      expect(mockNotification.notifySuccess).nthCalledWith(1, localize(Localization.COPIED_TO_CLIPBOARD_SUCCESS))
    })
  })
})
