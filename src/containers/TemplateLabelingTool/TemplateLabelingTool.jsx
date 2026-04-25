
import { Feature } from 'labeling-tool/lib/enums/Feature'
import { FieldType } from 'labeling-tool/lib/enums/FieldType'
import { Mode } from 'labeling-tool/lib/enums/Mode'
import { Panel } from 'labeling-tool/lib/enums/Panel'
import { Tool } from 'labeling-tool/lib/enums/Tool'
import { Field } from 'labeling-tool/lib/models/Field'
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { fetchDocumentType } from '@/api/documentTypesApi'
import { templatesApi } from '@/api/templatesApi'
import { extractionFieldsApi } from '@/apiRTK/extractionFieldsApi'
import { LabelingTool } from '@/components/LabelingTool'
import { Spin } from '@/components/Spin'
import { CreateOrChangeTypeFieldDrawerButton } from '@/containers/CreateOrChangeTypeFieldDrawerButton'
import { LocationChange } from '@/containers/LocationChange'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { EventEmitter } from '@/models/EventEmitter'
import { FileCache } from '@/services/FileCache'
import { apiMap } from '@/utils/apiMap'
import { ENV } from '@/utils/env'
import { fetchImage } from '@/utils/image'
import { navigationMap } from '@/utils/navigationMap'
import {
  notifyRequest,
  notifyError,
  notifyWarning,
} from '@/utils/notification'
import { goBack, goTo } from '@/utils/routerActions'
import { mapVersionMarkupToLabels } from './mappers'

const SUPPORTED_FIELD_TYPES = [
  FieldType.STRING,
  FieldType.CHECKMARK,
  FieldType.DATE,
]

const cacheVersionImages = ({ referencePages }) => {
  const urls = referencePages.map((page) => apiMap.apiGatewayV2.v5.file.blob(page.blobName))

  FileCache.requestAndStore(urls)
}

class TemplateLabelingTool extends PureComponent {
  static propTypes = {
    templateId: PropTypes.string.isRequired,
    versionId: PropTypes.string.isRequired,
    createExtractionField: PropTypes.func.isRequired,
    deleteExtractionField: PropTypes.func.isRequired,
  }

  onClose = new EventEmitter()

  state = {
    fetching: true,
    version: null,
    fields: [],
    documentTypeName: '',
  }

  getDocumentType = async (templateId) => {
    try {
      const extras = [
        DocumentTypeExtras.EXTRACTION_FIELDS,
      ]
      ENV.FEATURE_LLM_EXTRACTORS && extras.push(DocumentTypeExtras.LLM_EXTRACTORS)

      const documentType = await fetchDocumentType(templateId, extras)

      return {
        ...documentType,
        fields: documentType.fields?.filter((f) =>
          DocumentTypeField.getFieldCategory(f.code, documentType.llmExtractors) === DocumentTypeFieldCategory.EXTRACTION),
      }
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }

  saveMarkup = async (markup, rotationAngles, language, fields) => {
    const documentType = await this.getDocumentType(this.props.templateId)
    let templateFields = documentType.fields

    const fieldsToDelete = templateFields.filter(
      (f) => fields.every((field) => (
        field.name !== f.name ||
        field.fieldType !== f.fieldType ||
        field.required !== f.required
      )),
    )

    if (fieldsToDelete.length) {
      await this.props.deleteExtractionField({
        documentTypeCode: this.props.templateId,
        fieldCodes: fieldsToDelete.map((f) => f.code),
      })
    }

    const fieldsToSave = fields.filter(
      (f) => templateFields.every((field) => (
        field.name !== f.name ||
        field.fieldType !== f.fieldType ||
        field.required !== f.required
      )),
    )

    if (fieldsToSave.length) {
      try {
        for (const field of fieldsToSave) {
          await this.props.createExtractionField({
            documentTypeCode: this.props.templateId,
            field,
          })
        }
      } catch (e) {
        const message = RESOURCE_ERROR_TO_DISPLAY[e?.response?.data?.code] ?? localize(Localization.MARKUP_SAVING_ERROR)
        notifyError(message)
      }
    }

    if (fieldsToDelete.length || fieldsToSave.length) {
      const documentType = await this.getDocumentType(this.props.templateId)
      templateFields = documentType.fields
    }

    await notifyRequest(
      templatesApi.saveVersionMarkup({
        markup,
        referencePages: this.state.version.referencePages,
        templateFields,
        templateId: this.props.templateId,
        versionId: this.props.versionId,
      }),
    )({
      fetching: localize(Localization.MARKUP_SAVING),
      success: localize(Localization.MARKUP_SAVING_SUCCESS),
      warning: localize(Localization.MARKUP_SAVING_ERROR),
    })
  }

  getImage = async (url) => {
    let cachedBlob

    if (ENV.FEATURE_FILE_CACHE) {
      cachedBlob = await FileCache.get(url)
    }

    if (cachedBlob) {
      return URL.createObjectURL(cachedBlob)
    }

    const blob = await fetchImage(url)
    return blob
  }

  getApi = () => ({
    close: this.close,
    getImage: this.getImage,
    saveMarkup: this.saveMarkup,
    addFieldForm: this.getAddFieldForm,
    notify: {
      error: notifyError,
    },
  })

  getAddFieldForm = ({ onSave, children }) => (
    <CreateOrChangeTypeFieldDrawerButton
      allowedFieldTypes={SUPPORTED_FIELD_TYPES}
      onSave={onSave}
    >
      {children}
    </CreateOrChangeTypeFieldDrawerButton>
  )

  getLabelingToolSettings = () => ({
    mode: Mode.MARKUP,
    features: [
      Feature.PAGING,
      Feature.EXPORT,
      Feature.IMPORT,
      Feature.MANAGE_FIELDS,
      Feature.MULTI_ASSIGN_LABELS,
    ],
    panels: [
      Panel.TOOLBAR,
      Panel.MARKUP_SIDEBAR,
      Panel.LEFT_SIDEBAR,
    ],
    tools: [
      Tool.LABEL,
      Tool.POINTER,
      Tool.GRABBING,
    ],
  })

  getDocument = () => {
    const { referencePages, name } = this.state.version
    const pages = referencePages.map((page) => apiMap.apiGatewayV2.v5.file.blob(page.blobName))
    const extraName = this.state.documentTypeName

    return {
      pages,
      name,
      extraName,
    }
  }

  getFields = () => {
    return this.state.fields
      .filter((f) => SUPPORTED_FIELD_TYPES.includes(f.fieldType))
      .map((f) => (
        new Field(
          f.code,
          f.name,
          f.fieldType,
          undefined,
          f.required,
        )),
      )
  }

  getConfig = () => {
    const document = this.getDocument()
    const fields = this.getFields()
    const api = this.getApi()
    const settings = this.getLabelingToolSettings()
    const markup = mapVersionMarkupToLabels(this.state.version.referencePages, this.state.fields)
    const events = {
      onClose: this.onClose.subscribe,
    }

    return ({
      document,
      markup,
      fields,
      api,
      settings,
      events,
    })
  }

  close = (force = true) => {
    this.force = force
    goBack()
  }

  onDeactivate = () => {
    if (this.force) {
      this.force = false
      return Promise.resolve(false)
    }

    return Promise.resolve(this.onClose.fire())
  }

  componentDidMount = async () => {
    const { templateId, versionId } = this.props

    const [
      { value: version, reason: error },
      { value: documentType },
    ] = await Promise.allSettled([
      templatesApi.fetchTemplateVersion(templateId, versionId),
      this.getDocumentType(templateId),
    ])

    if (error?.response?.status === StatusCode.NOT_FOUND) {
      return goTo(navigationMap.error.notFound())
    }

    this.setState({
      fetching: false,
      fields: documentType.fields,
      version,
      documentTypeName: documentType.name,
    })

    ENV.FEATURE_FILE_CACHE && cacheVersionImages(version)
  }

  render = () => {
    if (this.state.fetching) {
      return <Spin.Centered spinning />
    }

    return (
      <>
        <LabelingTool config={this.getConfig()} />
        <LocationChange
          onDeactivate={this.onDeactivate}
        />
      </>
    )
  }
}

const mapDispatchToProps = {
  createExtractionField: extractionFieldsApi.endpoints.createExtractionField.initiate,
  deleteExtractionField: extractionFieldsApi.endpoints.deleteExtractionField.initiate,
}

const ConnectedComponent = connect(null, mapDispatchToProps)(TemplateLabelingTool)

export {
  ConnectedComponent as TemplateLabelingTool,
}
