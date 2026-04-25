
import { HelpAnswer } from '@/containers/FrequentlyAskedQuestions/FrequentlyAskedQuestions.styles'
import { Localization, localize } from '@/localization/i18n'
import { ValidationImage } from './Validation.styles'

const Validation = () => (
  <HelpAnswer>
    <div>
      <p>{localize(Localization.VALIDATION_PARAGRAPH_1)}</p>
      <p>{localize(Localization.VALIDATION_PARAGRAPH_2)}</p>
      <p>{localize(Localization.VALIDATION_PARAGRAPH_3)}</p>
    </div>
    <ValidationImage />
  </HelpAnswer>
)

export {
  Validation,
}
