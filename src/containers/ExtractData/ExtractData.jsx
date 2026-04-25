
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { extractData } from '@/actions/documents'
import { fetchOCREngines } from '@/actions/engines'
import { Button } from '@/components/Button'
import { ModalFormButton } from '@/components/ModalFormButton'
import { CustomSelect } from '@/components/Select'
import { ComponentSize } from '@/enums/ComponentSize'
import { DocumentState } from '@/enums/DocumentState'
import { KnownOCREngine } from '@/enums/KnownOCREngine'
import { localize, Localization } from '@/localization/i18n'
import { Engine, engineShape } from '@/models/Engine'
import { ocrEnginesSelector } from '@/selectors/engines'
import { areEnginesFetchingSelector } from '@/selectors/requests'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { ModalTitle, ExclamationCircleOutlinedIcon } from './ExtractData.styles'

class ExtractData extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    initialEngine: PropTypes.oneOf(Object.values(KnownOCREngine)),
    documentState: PropTypes.oneOf(Object.values(DocumentState)),
    children: PropTypes.string.isRequired,
    extractData: PropTypes.func.isRequired,
    engines: PropTypes.arrayOf(engineShape).isRequired,
    fetchOCREngines: PropTypes.func.isRequired,
    enginesFetching: PropTypes.bool,
    documentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  componentDidMount () {
    this.props.fetchOCREngines()
  }

  getFields = () => ({
    engineCode: {
      label: localize(Localization.ENGINE),
      render: () => (
        <CustomSelect
          fetching={this.props.enginesFetching}
          options={Engine.toAllEnginesOptions(this.props.engines)}
          placeholder={localize(Localization.ENGINE_PLACEHOLDER)}
        />
      ),
      initialValue: this.props.initialEngine ?? KnownOCREngine.TESSERACT,
    },
  })

  extractDocument = async (engineCode) => {
    const updatedDocuments = await this.props.extractData(engineCode, this.props.documentIds)

    if (updatedDocuments?.length) {
      notifySuccess(localize(Localization.FETCHING_DATA_EXTRACTION, { count: updatedDocuments.length }),
        localize(Localization.FETCHING_DATA_EXTRACTION_DESCRIPTION))
    } else {
      notifyWarning(localize(Localization.DATA_EXTRACTION_WARNING, { count: this.props.documentIds.length }),
        localize(Localization.WARNING_DESCRIPTION))
    }
  }

  getContent = () => localize(
    Localization.CONTENT_CONFIRM_MODAL,
    this.props.documentState === DocumentState.COMPLETED
      ? { text: localize(Localization.CONTENT_ADDITIONAL_TEXT) }
      : { text: '' },
  )

  onOk = ({ engineCode }) => {
    this.extractDocument(engineCode)
  }

  renderOpenButton = (open) => (
    <Button.Text
      disabled={this.props.disabled}
      onClick={open}
    >
      {this.props.children}
    </Button.Text>
  )

  render = () => (
    <ModalFormButton
      disabled={this.props.disabled}
      fields={this.getFields()}
      okButtonProps={
        {
          text: localize(Localization.OK),
        }
      }
      onOk={this.onOk}
      renderOpenTrigger={this.renderOpenButton}
      size={ComponentSize.SMALL}
      text={
        (
          <h4>
            {this.getContent()}
          </h4>
        )
      }
      title={
        (
          <>
            <ExclamationCircleOutlinedIcon />
            <ModalTitle>
              {localize(Localization.EXTRACT_CONFIRM_TITLE)}
            </ModalTitle>
          </>
        )
      }
    />
  )
}

const mapStateToProps = (state) => ({
  engines: ocrEnginesSelector(state),
  enginesFetching: areEnginesFetchingSelector(state),
})

const mergeProps = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  ...ownProps,
  extractData: (engineCode, ids) => dispatch(extractData(ids, engineCode)),
  fetchOCREngines: () => dispatch(fetchOCREngines()),
})

const ConnectedComponent = connect(mapStateToProps, null, mergeProps)(ExtractData)

export {
  ConnectedComponent as ExtractData,
}
