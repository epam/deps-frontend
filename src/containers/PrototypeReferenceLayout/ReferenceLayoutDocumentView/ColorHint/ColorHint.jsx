
import { Badge } from '@/components/Badge'
import { localize, Localization } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import {
  HintWrapper,
  HintItem,
} from './ColorHint.styles'

const HINTS = [
  {
    label: localize(Localization.UNASSIGNED),
    color: theme.color.orange,
  },
  {
    label: localize(Localization.ASSIGNED),
    color: theme.color.greenBright,
  },
  {
    label: localize(Localization.ACTIVE),
    color: theme.color.primary2,
  },
]

const ColorHint = () => (
  <HintWrapper>
    {
      HINTS.map(({ label, color }) => (
        <HintItem key={label}>
          <Badge color={color} />
          {label}
        </HintItem>
      ))
    }
  </HintWrapper>
)

export { ColorHint }
