
import { HelpAnswer } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import { UploadImage, AdditionalUploadImage } from './UploadDocument.styles'

const UploadDocument = () => (
  <>
    <HelpAnswer>
      <div>
        <p><b>{localize(Localization.UPLOAD_DOCUMENT_SUBTITLE_1)}</b></p>
        <p>{localize(Localization.UPLOAD_DOCUMENT_PARAGRAPH_1)}</p>
        <p><b>{localize(Localization.UPLOAD_DOCUMENT_SUBTITLE_2)}</b></p>
        <p>
          <b>{localize(Localization.UPLOAD_DOCUMENT_STEP_1)}</b>
          {localize(Localization.UPLOAD_DOCUMENT_PARAGRAPH_2)}
        </p>
        <p>
          <b>{localize(Localization.UPLOAD_DOCUMENT_STEP_2)}</b>
          {localize(Localization.UPLOAD_DOCUMENT_PARAGRAPH_3)}
        </p>
        <p>
          <b>{localize(Localization.UPLOAD_DOCUMENT_STEP_3)}</b>
          {localize(Localization.UPLOAD_DOCUMENT_PARAGRAPH_4)}
        </p>
        <p>
          <b>{localize(Localization.UPLOAD_DOCUMENT_STEP_4)}</b>
          {localize(Localization.UPLOAD_DOCUMENT_PARAGRAPH_5)}
        </p>
      </div>
      <UploadImage />
    </HelpAnswer>
    <HelpAnswer>
      <div>
        <p><b>{localize(Localization.UPLOAD_DOCUMENT_SUBTITLE_3)}</b></p>
        <p>{localize(Localization.UPLOAD_DOCUMENT_PARAGRAPH_6)}</p>
        <ol>
          <li>{localize(Localization.UPLOAD_DOCUMENT_LIST_ITEM_1)}</li>
          <li>
            {localize(Localization.UPLOAD_DOCUMENT_LIST_ITEM_2)}
            <ul>
              <li>{localize(Localization.UPLOAD_DOCUMENT_SUBLIST_ITEM_1)}</li>
              <li>{localize(Localization.UPLOAD_DOCUMENT_SUBLIST_ITEM_2)}</li>
              <li>{localize(Localization.UPLOAD_DOCUMENT_SUBLIST_ITEM_3)}</li>
              <li>{localize(Localization.UPLOAD_DOCUMENT_SUBLIST_ITEM_4)}</li>
            </ul>
          </li>
        </ol>
      </div>
      <AdditionalUploadImage />
    </HelpAnswer>
  </>
)

export {
  UploadDocument,
}
