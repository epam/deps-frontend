
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { PenIcon } from '@/components/Icons/PenIcon'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { DeleteValidationRuleButton } from '@/containers/DeleteValidationRuleButton'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { EditBusinessRuleButton } from '../EditBusinessRuleButton'
import { ActionIcon } from './ValidatorCardActions.styles'

const ValidatorCardActions = ({
  fieldNames,
  name,
  validatorId,
  validatorCategory,
}) => {
  const renderDeleteTrigger = useCallback((onClick) => (
    <ActionIcon
      icon={<TrashIcon />}
      onClick={onClick}
    />
  ), [])

  const renderEditTrigger = useCallback(({ disabled, onClick }) => (
    <ActionIcon
      disabled={disabled}
      icon={<PenIcon />}
      onClick={onClick}
    />
  ), [])

  return (
    <>
      <EditBusinessRuleButton
        renderTrigger={renderEditTrigger}
        validatorCategory={validatorCategory}
        validatorId={validatorId}
      />
      <DeleteValidationRuleButton
        fieldNames={fieldNames}
        renderTrigger={renderDeleteTrigger}
        ruleName={name}
        validatorCategory={validatorCategory}
        validatorId={validatorId}
      />
    </>
  )
}

ValidatorCardActions.propTypes = {
  fieldNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  validatorId: PropTypes.string.isRequired,
  validatorCategory: PropTypes.oneOf(Object.values(ValidatorCategory)).isRequired,
}

export { ValidatorCardActions }
