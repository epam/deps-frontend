
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { SelectOptionModalButton } from '@/components/SelectOptionModalButton'
import { Language } from '@/models/Language'
import { languagesSelector } from '@/selectors/languages'
import { ChangeDocumentLanguageButton } from '.'

jest.mock('react-redux', () => mockReactRedux)

const mockState = 'mockState'

jest.mock('@/selectors/languages')
jest.mock('@/selectors/requests')
jest.mock('@/utils/env', () => mockEnv)

const { mapStateToProps, ConnectedComponent } = ChangeDocumentLanguageButton

const mockDocumentLanguages = [new Language('rus', 'Russian'), new Language('eng', 'English')]

describe('Container: ChangeDocumentLanguageButton', () => {
  describe('mapStateToProps', () => {
    it('should call to languagesSelector with state and pass the result as language prop', () => {
      const { props } = mapStateToProps(mockState)

      expect(languagesSelector).toHaveBeenCalledWith(mockState)
      expect(props.languages).toEqual(languagesSelector.getSelectorMockValue())
    })

    describe('Component: ChangeDocumentLanguageButton', () => {
      let defaultProps
      let wrapper

      beforeEach(() => {
        defaultProps = {
          children: 'Change Document Language',
          disabled: false,
          languages: mockDocumentLanguages,
          updateDocumentLanguage: jest.fn(),
        }

        wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      })

      it('should render ChangeDocumentLanguageButton with correct props', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('should pass correct document languages to SelectOptionModalButton component as options prop', () => {
        const filteredDocumentLang = Language.toOption(defaultProps.languages[0])
        expect(wrapper.find(SelectOptionModalButton).props().options[0]).toEqual(filteredDocumentLang)
      })
    })
  })
})
