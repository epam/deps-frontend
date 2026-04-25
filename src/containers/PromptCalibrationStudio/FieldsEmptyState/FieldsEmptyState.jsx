
import PropTypes from 'prop-types'
import { localize, Localization } from '@/localization/i18n'
import { AddFieldDrawer } from '../AddFieldDrawer'
import {
  EmptyStateContainer,
  EmptyStateImage,
  EmptyStateText,
} from './FieldsEmptyState.styles'

export const FieldsEmptyState = ({ add, defaultExtractorId }) => (
  <EmptyStateContainer>
    <EmptyStateImage />
    <EmptyStateText>
      {localize(Localization.NO_ITEMS_MESSAGE)}
    </EmptyStateText>
    <AddFieldDrawer
      add={add}
      defaultExtractorId={defaultExtractorId}
    />
  </EmptyStateContainer>
)

FieldsEmptyState.propTypes = {
  add: PropTypes.func.isRequired,
  defaultExtractorId: PropTypes.string.isRequired,
}
