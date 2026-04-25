
import { HelpAnswer } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import { FirstExtractImage, SecondExtractImage, ThirdExtractImage } from './ExtractData.styles'

const ExtractData = () => (
  <>
    <HelpAnswer>
      <div>
        <p>{localize(Localization.EXTRACT_DATA_PARAGRAPH_1)}</p>
        <p>{localize(Localization.EXTRACT_DATA_PARAGRAPH_2)}</p>
        <ul>
          <li>{localize(Localization.EXTRACT_DATA_LIST_1_ITEM_1)}</li>
          <li>{localize(Localization.EXTRACT_DATA_LIST_1_ITEM_2)}</li>
          <li>{localize(Localization.EXTRACT_DATA_LIST_1_ITEM_3)}</li>
          <li>{localize(Localization.EXTRACT_DATA_LIST_1_ITEM_4)}</li>
        </ul>
        <p>{localize(Localization.EXTRACT_DATA_PARAGRAPH_3)}</p>
        <ul>
          <li>{localize(Localization.EXTRACT_DATA_LIST_2_ITEM_1)}</li>
          <li>{localize(Localization.EXTRACT_DATA_LIST_2_ITEM_2)}</li>
          <li>{localize(Localization.EXTRACT_DATA_LIST_2_ITEM_3)}</li>
          <li>{localize(Localization.EXTRACT_DATA_LIST_2_ITEM_4)}</li>
        </ul>
        <p>{localize(Localization.EXTRACT_DATA_PARAGRAPH_4)}</p>
      </div>
      <FirstExtractImage />
    </HelpAnswer>
    <HelpAnswer>
      <div>
        <p>{localize(Localization.EXTRACT_DATA_PARAGRAPH_5)}</p>
        <p>{localize(Localization.EXTRACT_DATA_PARAGRAPH_6)}</p>
      </div>
      <SecondExtractImage />
    </HelpAnswer>
    <ThirdExtractImage />
  </>
)

export {
  ExtractData,
}
