
import { HelpAnswer } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import { FirstExportImage, SecondExportImage } from './ExportData.styles'

const ExportData = () => (
  <>
    <div>
      <p>{localize(Localization.EXPORT_DATA_PARAGRAPH_1)}</p>
      <ol>
        <li>{localize(Localization.EXPORT_DATA_LIST_ITEM_1)}</li>
        <li>{localize(Localization.EXPORT_DATA_LIST_ITEM_2)}</li>
      </ol>
    </div>
    <HelpAnswer>
      <FirstExportImage />
      <SecondExportImage />
    </HelpAnswer>
  </>

)

export {
  ExportData,
}
