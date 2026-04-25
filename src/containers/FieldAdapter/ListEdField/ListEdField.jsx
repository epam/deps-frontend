
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { highlightPolygonCoordsField, highlightTableCoordsField } from '@/actions/documentReviewPage'
import { ListCoordsHighlightTrigger } from '@/containers/CoordsHighlightTrigger'
import { FieldLabel, FieldWrapper } from '@/containers/DocumentField'
import { CheckmarkEdField } from '@/containers/FieldAdapter/CheckmarkEdField'
import { DateEdField } from '@/containers/FieldAdapter/DateEdField'
import { EnumEdField } from '@/containers/FieldAdapter/EnumEdField'
import { Flags } from '@/containers/FieldAdapter/Flags'
import { KeyValuePairEdField, KeyValuePairEdFieldActionsMenu } from '@/containers/FieldAdapter/KeyValuePairEdField'
import { ValidationIcons } from '@/containers/FieldAdapter/ListEdField/ValidationIcons'
import { mapDataCoordsToHighlightedCoords, mapHighlightedCoordsToUniqueHighlightedCoords } from '@/containers/FieldAdapter/mappers'
import { PrimitiveEdFieldActionsMenu } from '@/containers/FieldAdapter/PrimitiveEdFieldActionsMenu'
import { PromptPreviewButton } from '@/containers/FieldAdapter/PromptPreviewButton'
import { StringEdField } from '@/containers/FieldAdapter/StringEdField'
import { TableEdField, TableEdFieldActionsMenu } from '@/containers/FieldAdapter/TableEdField'
import { FieldLabelAdapter } from '@/containers/FieldLabelAdapter'
import { InView, getSeparatedId } from '@/containers/InView'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { Document, documentShape } from '@/models/Document'
import { DocumentTypeField, documentTypeFieldShape } from '@/models/DocumentTypeField'
import { FieldValidation, fieldValidationShape } from '@/models/DocumentValidation'
import { ExtractedDataField, extractedDataFieldShape } from '@/models/ExtractedData'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import { documentSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { AddOrEditFieldAliasButton } from '../AddOrEditFieldAliasButton'
import { AddSubFieldButton } from './AddSubFieldButton'
import { DeleteSubFieldButton } from './DeleteSubFieldButton'
import {
  InfoWrapper,
  InfoWrapperCell,
  ListItemWrapper,
} from './ListEdField.styles'
import { useListItemsAliases } from './useListItemsAliases'

const SUB_FIELD_TYPE_TO_RENDER_MAPPER = {
  [FieldType.CHECKMARK]: CheckmarkEdField,
  [FieldType.ENUM]: EnumEdField,
  [FieldType.TABLE]: TableEdField,
  [FieldType.STRING]: StringEdField,
  [FieldType.DICTIONARY]: KeyValuePairEdField,
  [FieldType.DATE]: DateEdField,
}

const mapSubFieldTypeToRender = (fieldType) => SUB_FIELD_TYPE_TO_RENDER_MAPPER[fieldType] ?? StringEdField

const ACTIONS_MENU_TYPE_TO_RENDER_MAPPER = {
  [FieldType.CHECKMARK]: PrimitiveEdFieldActionsMenu,
  [FieldType.TABLE]: TableEdFieldActionsMenu,
  [FieldType.STRING]: PrimitiveEdFieldActionsMenu,
  [FieldType.DICTIONARY]: KeyValuePairEdFieldActionsMenu,
}

const mapActionMenuToRender = (fieldType) => ACTIONS_MENU_TYPE_TO_RENDER_MAPPER[fieldType] ?? PrimitiveEdFieldActionsMenu

const ListEdField = ({
  active,
  disabled,
  dtField,
  edField,
  validation,
  documentId,
  document,
  highlightPolygonCoordsField,
  highlightTableCoordsField,
  promptChain,
}) => {
  const {
    isSaving: isItemAliasSaving,
    onSave: onItemAliasSave,
  } = useListItemsAliases(dtField, edField, documentId)

  const adjustedListEd = useMemo(() => (
    edField.data
      ?.flatMap((d) => (
        dtField.fieldMeta.baseType === FieldType.DICTIONARY
          ? [d.key, d.value]
          : [d]
      ))
      .filter((d) => !d.sourceTextCoordinates)
      .filter((d) => ExtractedDataField.hasCoordinates(d))
  ), [
    dtField.fieldMeta.baseType,
    edField.data,
  ])

  const highlightCoords = (field, page, sourceId) => {
    const [edField] = adjustedListEd

    const {
      tableCoordinates,
      sourceBboxCoordinates,
      sourceTableCoordinates,
      coordinates,
    } = edField

    if (sourceBboxCoordinates || coordinates) {
      highlightPolygonCoordsField({
        field,
        sourceId,
        page,
      })
      return
    }

    if (sourceTableCoordinates || tableCoordinates?.length) {
      highlightTableCoordsField({
        field,
        sourceId,
        page,
      })
    }
  }

  const sortHighlightedCoordsByPages = useCallback((coords) => (
    coords.sort((a, b) => {
      if (a.sourceId) {
        const pageA = Document.getPageBySourceId(document, a.sourceId)
        const pageB = Document.getPageBySourceId(document, b.sourceId)

        return pageA - pageB
      }

      return a.page - b.page
    })
  ), [document])

  const listFieldsCoords = useMemo(() => {
    const listCoords = adjustedListEd.flatMap((d) => mapDataCoordsToHighlightedCoords(d))

    if (listCoords?.length) {
      const uniqueHighlightedCoords = mapHighlightedCoordsToUniqueHighlightedCoords(listCoords)

      return sortHighlightedCoordsByPages(uniqueHighlightedCoords)
    }

    return null
  }, [
    adjustedListEd,
    sortHighlightedCoordsByPages,
  ])

  const listValidationConfig = useMemo(() => {
    if (!validation) {
      return null
    }

    const allWarnings = FieldValidation.getAllWarnings(validation)
    const allErrors = FieldValidation.getAllErrors(validation)

    if (!allErrors.length && !allWarnings.length) {
      return null
    }

    return Object.entries(validation).reduce((acc, [type, issues]) => {
      acc[type] = issues?.length ? issues : null
      return acc
    }, {})
  }, [validation])

  const modifiedBy = useMemo(() => {
    const data = edField?.data.find((d) => d.key?.modifiedBy || d.value?.modifiedBy || d.modifiedBy)

    return data?.modifiedBy || data?.key?.modifiedBy || data?.value?.modifiedBy
  }, [edField])

  const getExtraActions = useCallback((
    subEdField,
    subDtField,
    listItemId,
  ) => [
    {
      content: () => (
        <AddOrEditFieldAliasButton
          alias={subDtField.name}
          containerId={listItemId}
          disabled={disabled}
          field={subEdField}
          isSaving={isItemAliasSaving}
          onSave={onItemAliasSave}
        />
      ),
    },
    {
      content: () => (
        <DeleteSubFieldButton
          documentId={documentId}
          dtField={dtField}
          edField={edField}
          fieldToDeleteIndex={subEdField.data.index}
        >
          {localize(Localization.DELETE_FIELD)}
        </DeleteSubFieldButton>
      ),
    },
  ], [
    disabled,
    documentId,
    dtField,
    edField,
    isItemAliasSaving,
    onItemAliasSave,
  ])

  const renderActions = useCallback((subEdField, subDtField, listItemId) => () => {
    const ActionsMenu = mapActionMenuToRender(subDtField.fieldType)

    return (
      <ActionsMenu
        disabled={disabled}
        dtField={subDtField}
        edField={subEdField}
        extraActions={getExtraActions(subEdField, subDtField, listItemId)}
      />
    )
  }, [
    disabled,
    getExtraActions,
  ])

  const renderLabel = useCallback((dtField) => {
    if (!dtField.name) {
      return null
    }

    return (
      <FieldLabelAdapter
        active={active}
        dtField={dtField}
      />
    )
  }, [active])

  const ListItems = useMemo(() => (
    edField.data?.map((fd, i) => {
      const subFieldConfig = DocumentTypeField.mapListFieldToDocumentTypeFieldConfigItem(
        dtField,
        fd.index,
        edField.aliases?.[fd.id],
      )
      const subEdField = new ExtractedDataField(uuidv4(), fd)
      const listItemId = getSeparatedId(subFieldConfig.code, subFieldConfig.fieldIndex)

      const itemValidation = validation && Object.entries(validation).reduce((acc, [type, issues]) => {
        acc[type] = issues?.filter((e) => subEdField.data?.index === e.index)
        return acc
      }, {})

      const EdField = mapSubFieldTypeToRender(subFieldConfig.fieldType)

      return (
        <ListItemWrapper
          key={subFieldConfig.code + i}
          $type={subFieldConfig.fieldType}
        >
          <InView id={listItemId}>
            <EdField
              disabled={disabled}
              documentId={documentId}
              dtField={subFieldConfig}
              edField={subEdField}
              id={listItemId}
              renderActions={renderActions(subEdField, subFieldConfig, listItemId)}
              renderLabel={renderLabel}
              validation={itemValidation}
            />
          </InView>
        </ListItemWrapper>
      )
    })
  ),
  [
    edField.aliases,
    edField.data,
    dtField,
    validation,
    disabled,
    renderActions,
    documentId,
    renderLabel,
  ])

  const isAddSubFieldAllowed = useMemo(() => {
    const { fieldMeta: { baseType: fieldType } } = dtField
    return (
      ENV.FEATURE_LIST_EDITING_MODE &&
      (
        !ENV.FEATURE_PAGINATED_TABLES ||
        fieldType !== FieldType.TABLE
      )
    )
  }, [dtField])

  const shouldRenderConfidenceFlag = !!edField.confidence || ENV.FEATURE_SHOW_NOT_APPLICABLE_CONFIDENCE

  return (
    <FieldWrapper>
      <InView id={dtField.code}>
        <InfoWrapper>
          <InfoWrapperCell>
            <FieldLabel
              name={dtField.name}
              required={dtField.required}
            />
            {
              listValidationConfig && (
                <ValidationIcons
                  dtField={dtField}
                  validation={listValidationConfig}
                />
              )
            }
          </InfoWrapperCell>
          <InfoWrapperCell>
            {
              listFieldsCoords && (
                <ListCoordsHighlightTrigger
                  coords={listFieldsCoords}
                  document={document}
                  highlightArea={highlightCoords}
                />
              )
            }
            <Flags
              comments={edField.comments}
              {...(shouldRenderConfidenceFlag && { confidence: edField.confidence })}
              modifiedBy={modifiedBy}
            />
            {
              isAddSubFieldAllowed && (
                <AddSubFieldButton
                  disabled={disabled}
                  documentId={documentId}
                  dtField={dtField}
                  edField={edField}
                />
              )
            }
            <PromptPreviewButton promptChain={promptChain} />
          </InfoWrapperCell>
        </InfoWrapper>
        {ListItems}
      </InView>
    </FieldWrapper>
  )
}

ListEdField.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  edField: extractedDataFieldShape.isRequired,
  validation: fieldValidationShape,
  documentId: PropTypes.string.isRequired,
  document: documentShape.isRequired,
  highlightPolygonCoordsField: PropTypes.func.isRequired,
  highlightTableCoordsField: PropTypes.func.isRequired,
  promptChain: PropTypes.arrayOf(llmExtractionQueryNodeShape),
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
})

const mapDispatchToProps = {
  highlightPolygonCoordsField,
  highlightTableCoordsField,
}

const FieldContainer = connect(mapStateToProps, mapDispatchToProps)(ListEdField)

export {
  FieldContainer as ListEdField,
}
