
import { Tab } from '@/components/Tabs'
import { DocumentFields } from '@/containers/DocumentFields'
import { localize, Localization } from '@/localization/i18n'
import { ExtractedData } from '@/models/ExtractedData'
import { getExtractedDataToDisplay } from '../getExtractedDataToDisplay'

const WITHOUT_FIELD_SET_KEY = 'without_field_set'

const mapExtractedDataToTabsByFieldsSetIndex = ({
  document,
  documentType,
  ShouldHideEmptyEdFields,
}) => {
  const edToDisplay = getExtractedDataToDisplay({
    extractedData: document.extractedData,
    documentType,
    ShouldHideEmptyEdFields,
  })

  const setIndexes = ExtractedData.getSetIndexes(edToDisplay)

  return (
    setIndexes
      .map((index) => parseInt(index))
      .sort((a, b) => a - b || isNaN(a) - isNaN(b))
      .map((setIndex) => (
        new Tab(
          !isNaN(setIndex) ? `${setIndex}` : WITHOUT_FIELD_SET_KEY,
          !isNaN(setIndex)
            ? `${localize(Localization.FIELD_SET_TAB_NAME, { setIndex })}`
            : `${localize(Localization.WITHOUT_FIELD_SET)}`,
          <DocumentFields
            fields={ExtractedData.getFieldsBySetIndex(edToDisplay, setIndex)}
          />,
        )),
      )
  )
}

export {
  mapExtractedDataToTabsByFieldsSetIndex,
}
