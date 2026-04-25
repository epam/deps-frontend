
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { SelectOptionModalButton } from '@/components/SelectOptionModalButton'
import { localize, Localization } from '@/localization/i18n'
import { Language, languageShape } from '@/models/Language'
import { languagesSelector } from '@/selectors/languages'

const CHANGE_LANGUAGE = 'changeLanguage'

class ChangeDocumentLanguageButton extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    languages: PropTypes.arrayOf(languageShape).isRequired,
    disabled: PropTypes.bool,
    updateDocumentLanguage: PropTypes.func,
  }

  getLangOptions = () => (
    this.props.languages.map(Language.toOption)
  )

  render () {
    return (
      <SelectOptionModalButton
        key={CHANGE_LANGUAGE}
        disabled={this.props.disabled}
        emptySearchText={
          localize(Localization.EMPTY_SEARCH_TEXT, {
            object: `${localize(Localization.LANGUAGE).toLowerCase()}`,
          })
        }
        onSave={this.props.updateDocumentLanguage}
        options={this.getLangOptions()}
        placeholder={localize(Localization.PLACEHOLDER_DOCUMENT_LANGUAGE)}
        saveButtonText={localize(Localization.CONFIRM)}
        title={localize(Localization.CHANGE_DOCUMENT_LANGUAGE)}
      >
        {this.props.children}
      </SelectOptionModalButton>
    )
  }
}

const mapStateToProps = (state) => ({
  languages: languagesSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(ChangeDocumentLanguageButton)

export {
  ConnectedComponent as ChangeDocumentLanguageButton,
}
