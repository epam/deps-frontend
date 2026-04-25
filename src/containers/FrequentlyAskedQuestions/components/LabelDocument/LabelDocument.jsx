
import { WrapperImg } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import {
  OpenLtImage,
  LabelImage,
  PointerImage,
  LabelSelectionImage,
  SelectedLabelImage,
  AssignLabelImage,
  SaveImage,
  MarkupUpdateImage,
} from './LabelDocument.styles'

const LabelDocument = () => (
  <>
    <div>
      <p>
        <b>{localize(Localization.LABEL_DOCUMENT_DATA_LABELING)}</b>
        {localize(Localization.LABEL_DOCUMENT_PARAGRAPH_1)}
      </p>
      <p>{localize(Localization.LABEL_DOCUMENT_PARAGRAPH_2)}</p>
      <p>
        <b>{localize(Localization.LABEL_DOCUMENT_LABELING_TOOL)}</b>
        {localize(Localization.LABEL_DOCUMENT_PARAGRAPH_3)}
      </p>
      <p>{localize(Localization.LABEL_DOCUMENT_PARAGRAPH_4)}</p>
      <p>{localize(Localization.LABEL_DOCUMENT_PARAGRAPH_5)}</p>
      <p>{localize(Localization.LABEL_DOCUMENT_PARAGRAPH_6)}</p>
    </div>
    <OpenLtImage />
    <div>
      <p><b>{localize(Localization.LABEL_DOCUMENT_SUBTITLE_1)}</b></p>
      <p>
        <b>{localize(Localization.LABEL_DOCUMENT_STEP_1)}</b>
        {localize(Localization.LABEL_DOCUMENT_PARAGRAPH_7)}
      </p>
    </div>
    <LabelImage />
    <div>
      <p>
        <b>{localize(Localization.LABEL_DOCUMENT_STEP_2)}</b>
        {localize(Localization.LABEL_DOCUMENT_PARAGRAPH_8)}
      </p>
    </div>
    <PointerImage />
    <div>
      <p><b>{localize(Localization.LABEL_DOCUMENT_SUBTITLE_2)}</b></p>
      <p>
        <b>{localize(Localization.LABEL_DOCUMENT_STEP_3)}</b>
        {localize(Localization.LABEL_DOCUMENT_PARAGRAPH_9)}
      </p>
    </div>
    <WrapperImg>
      <LabelSelectionImage />
      <SelectedLabelImage />
    </WrapperImg>
    <div>
      <p>
        <b>{localize(Localization.LABEL_DOCUMENT_STEP_4)}</b>
        {localize(Localization.LABEL_DOCUMENT_PARAGRAPH_10)}
      </p>
    </div>
    <AssignLabelImage />
    <div>
      <p><b>{localize(Localization.LABEL_DOCUMENT_SUBTITLE_3)}</b></p>
      <p>
        <b>{localize(Localization.LABEL_DOCUMENT_STEP_5)}</b>
        {localize(Localization.LABEL_DOCUMENT_PARAGRAPH_11)}
      </p>
      <p>{localize(Localization.LABEL_DOCUMENT_PARAGRAPH_12)}</p>
      <p>{localize(Localization.LABEL_DOCUMENT_PARAGRAPH_13)}</p>
    </div>
    <SaveImage />
    <div>
      <p>
        <b>{localize(Localization.LABEL_DOCUMENT_STEP_6)}</b>
        {localize(Localization.LABEL_DOCUMENT_PARAGRAPH_14)}
      </p>
      <p>{localize(Localization.LABEL_DOCUMENT_PARAGRAPH_15)}</p>
    </div>
    <MarkupUpdateImage />
  </>
)

export {
  LabelDocument,
}
