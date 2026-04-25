
import { HelpAnswer } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeImage, UnknownTypeImage, StateImage } from './DefineDocumentType.styles'

const DefineDocumentType = () => (
  <>
    <div>
      <p>{localize(Localization.DEFINE_DOCUMENT_TYPE_PARAGRAPH_1)}</p>
      <p>{localize(Localization.DEFINE_DOCUMENT_TYPE_PARAGRAPH_2)}</p>
    </div>

    <HelpAnswer>
      <StateImage />
      <UnknownTypeImage />
    </HelpAnswer>

    <HelpAnswer>
      <div>
        <p>{localize(Localization.DEFINE_DOCUMENT_TYPE_PARAGRAPH_3)}</p>
        <p>{localize(Localization.DEFINE_DOCUMENT_TYPE_PARAGRAPH_4)}</p>
      </div>
      <DocumentTypeImage />
    </HelpAnswer>
  </>
)

export {
  DefineDocumentType,
}
