
import { useSelector } from 'react-redux'
import { Table } from '@/components/Table'
import { AddDocumentTypeFieldModalButton } from '@/containers/AddDocumentTypeFieldModalButton'
import { InfoPanel } from '@/containers/InfoPanel'
import { ReorderDocumentTypeFieldsButton } from '@/containers/ReorderDocumentTypeFieldsButton'
import { withParentSize } from '@/hocs/withParentSize'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { isDocumentTypeFetchingSelector } from '@/selectors/requests'
import { ENV } from '@/utils/env'
import {
  generateFieldCategoryColumn,
  generateFieldDisplayModeColumn,
  generateFieldNameColumn,
  generateFieldPromptChainColumn,
  generateFieldTypeColumn,
  generateFieldValidationRulesColumn,
  generateFieldActionsColumn,
  generateFieldLLMExtractor,
} from './columns'
import { Wrapper, ActionsWrapper } from './DocumentTypeFieldsList.styles'
import {
  mapExtractionFieldsToTableData,
  mapExtraFieldsToTableData,
  attachValidationRulesToField,
} from './fieldsMappers'
import { MoreFieldsActions } from './MoreFieldsActions'

const SizeAwareTable = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

const getTableColumns = (documentType) => [
  generateFieldNameColumn(),
  generateFieldCategoryColumn(),
  generateFieldTypeColumn(),
  ...(
    ENV.FEATURE_LLM_EXTRACTORS
      ? [generateFieldLLMExtractor({ documentType })]
      : []
  ),
  ...(
    ENV.FEATURE_VALIDATION_BUSINESS_RULES
      ? [generateFieldValidationRulesColumn(documentType)]
      : []
  ),
  ...(
    ENV.FEATURE_LLM_EXTRACTORS
      ? [generateFieldPromptChainColumn()]
      : []
  ),
  ...(
    ENV.FEATURE_FIELDS_DISPLAY_MODE
      ? [generateFieldDisplayModeColumn()]
      : []
  ),
  generateFieldActionsColumn({ documentType }),
]

const sortFieldsByOrder = (fields) => fields.sort((a, b) => a.order - b.order)

const getFieldsToDisplay = ({
  fields: extractionFields = [],
  extraFields = [],
  llmExtractors = [],
  validators = [],
  crossFieldValidators = [],
}) => {
  const mappedFields = [
    ...mapExtractionFieldsToTableData(extractionFields, llmExtractors),
    ...mapExtraFieldsToTableData(extraFields),
  ]
    .map((field) => attachValidationRulesToField(field, validators, crossFieldValidators))

  return sortFieldsByOrder(mappedFields)
}

const DocumentTypeFieldsList = () => {
  const documentType = useSelector(documentTypeStateSelector)
  const isFetching = useSelector(isDocumentTypeFetchingSelector)

  const fieldsToDisplay = getFieldsToDisplay(documentType)

  const sortedFields = sortFieldsByOrder(
    [...(documentType.fields || []), ...documentType.extraFields],
  )

  const rowKey = (record) => record.code

  const renderActions = () => (
    <ActionsWrapper>
      <ReorderDocumentTypeFieldsButton
        documentType={documentType}
        fields={sortedFields}
      />
      <AddDocumentTypeFieldModalButton />
      <MoreFieldsActions
        disabled={isFetching}
      />
    </ActionsWrapper>
  )

  return (
    <Wrapper>
      <InfoPanel
        fetching={isFetching}
        renderActions={renderActions}
        total={fieldsToDisplay.length}
      />
      <SizeAwareTable
        columns={getTableColumns(documentType)}
        data={fieldsToDisplay}
        fetching={isFetching}
        pagination={false}
        rowKey={rowKey}
      />
    </Wrapper>
  )
}

export {
  DocumentTypeFieldsList,
}
