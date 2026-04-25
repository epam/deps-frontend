
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { localize, Localization } from '@/localization/i18n'
import {
  EmptyStateContainer,
  EmptyStateImage,
  EmptyStateText,
} from './EmptyPromptState.styles'

export const EmptyPromptState = ({ onClick }) => (
  <EmptyStateContainer>
    <EmptyStateImage />
    <EmptyStateText>
      {localize(Localization.NO_ITEMS_MESSAGE)}
    </EmptyStateText>
    <Button.Secondary onClick={onClick}>
      <PlusIcon />
      {localize(Localization.ADD_PROMPT)}
    </Button.Secondary>
  </EmptyStateContainer>
)

EmptyPromptState.propTypes = {
  onClick: PropTypes.func.isRequired,
}
