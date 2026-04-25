
import { HelpAnswer } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import {
  ReviewProcessImage,
  DocumentReviewImage,
  ModifiedByImage,
  ConfidenceLevelImage,
} from './Review.styles'

const Review = () => (
  <>
    <HelpAnswer>
      <div>
        <p>{localize(Localization.REVIEW_PARAGRAPH_1)}</p>
        <p>{localize(Localization.REVIEW_PARAGRAPH_2)}</p>
        <p>{localize(Localization.REVIEW_PARAGRAPH_3)}</p>
        <p><b>{localize(Localization.REVIEW_SUBTITLE_1)}</b></p>
        <p>{localize(Localization.REVIEW_PARAGRAPH_4)}</p>
        <p>{localize(Localization.REVIEW_PARAGRAPH_5)}</p>
      </div>
      <ReviewProcessImage />
    </HelpAnswer>

    <div>
      <p>{localize(Localization.REVIEW_PARAGRAPH_6)}</p>
      <p>{localize(Localization.REVIEW_PARAGRAPH_7)}</p>
      <p>{localize(Localization.REVIEW_PARAGRAPH_8)}</p>
    </div>

    <ModifiedByImage />
    <ConfidenceLevelImage />

    <HelpAnswer>
      <div>
        <p><b>{localize(Localization.REVIEW_SUBTITLE_2)}</b></p>
        <p>{localize(Localization.REVIEW_PARAGRAPH_9)}</p>
        <p>{localize(Localization.REVIEW_PARAGRAPH_10)}</p>
        <ol>
          <li>{localize(Localization.REVIEW_LIST_1_ITEM_1)}</li>
          <li>{localize(Localization.REVIEW_LIST_1_ITEM_2)}</li>
          <li>{localize(Localization.REVIEW_LIST_1_ITEM_3)}</li>
        </ol>
        <p>{localize(Localization.REVIEW_PARAGRAPH_11)}</p>
        <ol>
          <li>{localize(Localization.REVIEW_LIST_2_ITEM_1)}</li>
          <li>{localize(Localization.REVIEW_LIST_2_ITEM_2)}</li>
        </ol>
      </div>
      <DocumentReviewImage />
    </HelpAnswer>
  </>
)

export {
  Review,
}
