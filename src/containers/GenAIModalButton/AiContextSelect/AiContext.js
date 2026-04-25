
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'

export const AiContext = {
  TEXT_ONLY: 'text-only',
  TEXT_AND_IMAGES: 'text-images',
}

export const AI_CONTEXT_TO_LABEL_MAPPER = {
  [AiContext.TEXT_ONLY]: localize(Localization.AI_CONTEXT_TEXT_ONLY),
  [AiContext.TEXT_AND_IMAGES]: localize(Localization.AI_CONTEXT_TEXT_AND_IMAGES),
}

export const AI_CONTEXT_TO_TOOLTIP_MAPPER = {
  [AiContext.TEXT_ONLY]: {
    title: localize(Localization.AI_CONTEXT_TEXT_ONLY_TOOLTIP),
    placement: Placement.LEFT,
  },
  [AiContext.TEXT_AND_IMAGES]: {
    title: localize(Localization.AI_CONTEXT_TEXT_AND_IMAGES_TOOLTIP),
    placement: Placement.LEFT,
  },
}
