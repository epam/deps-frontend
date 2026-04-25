
import { Tab } from '@/components/Tabs'
import { DocumentFields } from '@/containers/DocumentFields'
import { localize, Localization } from '@/localization/i18n'
import { getExtractedDataToDisplay } from '../getExtractedDataToDisplay'

const FIELDS_KEY = 'fields'

const mapExtractedDataToTabsByGroup = ({
  document,
  documentType,
  ShouldHideEmptyEdFields,
}) => {
  const edToDisplay = getExtractedDataToDisplay({
    extractedData: document.extractedData,
    documentType,
    ShouldHideEmptyEdFields,
  })

  return [
    new Tab(
      FIELDS_KEY,
      localize(Localization.FIELDS_TAB_NAME),
      <DocumentFields
        fields={edToDisplay}
      />,
    ),
  ]
}

export {
  mapExtractedDataToTabsByGroup,
}
