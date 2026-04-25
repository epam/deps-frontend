
import { HelpAnswer } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import {
  KeywordSearchImage,
  TitleSearchImage,
  FiltersImage,
  LabelAdditionImage,
  AddLabelImage,
  LabelFilterImage,
  DocumentLabelImage,
} from './Search.styles'

const Search = () => (
  <>
    <div>
      <p><b>{localize(Localization.SEARCH_SUBTITLE_1)}</b></p>
      <p>{localize(Localization.SEARCH_PARAGRAPH_1)}</p>
      <ul>
        <li>
          {localize(Localization.SEARCH_LIST_1_ITEM_1)}
          <KeywordSearchImage />
        </li>
        <li>
          {localize(Localization.SEARCH_LIST_1_ITEM_2)}
          <TitleSearchImage />
        </li>
      </ul>
    </div>

    <div>
      <p><b>{localize(Localization.SEARCH_SUBTITLE_2)}</b></p>
      <p>{localize(Localization.SEARCH_PARAGRAPH_2)}</p>
      <ul>
        <li>{localize(Localization.SEARCH_LIST_2_ITEM_1)}</li>
        <li>{localize(Localization.SEARCH_LIST_2_ITEM_2)}</li>
        <li>{localize(Localization.SEARCH_LIST_2_ITEM_3)}</li>
        <li>{localize(Localization.SEARCH_LIST_2_ITEM_4)}</li>
        <li>{localize(Localization.SEARCH_LIST_2_ITEM_5)}</li>
        <li>{localize(Localization.SEARCH_LIST_2_ITEM_6)}</li>
      </ul>
    </div>
    <FiltersImage />

    <div>
      <p><b>{localize(Localization.SEARCH_SUBTITLE_3)}</b></p>
      <p><b>{localize(Localization.SEARCH_SUBTITLE_4)}</b></p>
      <p>{localize(Localization.SEARCH_PARAGRAPH_3)}</p>
      <p>{localize(Localization.SEARCH_PARAGRAPH_4)}</p>
    </div>

    <HelpAnswer>
      <AddLabelImage />
      <LabelAdditionImage />
    </HelpAnswer>

    <p>{localize(Localization.SEARCH_PARAGRAPH_5)}</p>
    <HelpAnswer>
      <LabelFilterImage />
      <DocumentLabelImage />
    </HelpAnswer>
  </>
)

export {
  Search,
}
