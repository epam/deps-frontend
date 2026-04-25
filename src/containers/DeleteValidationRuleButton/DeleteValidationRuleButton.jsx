
import PropTypes from 'prop-types'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { useDeleteValidationRuleAction } from './useDeleteValidationRuleAction'

const DeleteValidationRuleButton = ({
  fieldNames,
  renderTrigger,
  ruleName,
  validatorId,
  validatorCategory,
}) => {
  const { confirmAndDeleteValidationRule } = useDeleteValidationRuleAction()

  const handleDelete = () => confirmAndDeleteValidationRule({
    fieldNames,
    ruleName,
    validatorCategory,
    validatorId,
  })

  return renderTrigger(handleDelete)
}

DeleteValidationRuleButton.propTypes = {
  fieldNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderTrigger: PropTypes.func.isRequired,
  ruleName: PropTypes.string.isRequired,
  validatorId: PropTypes.string.isRequired,
  validatorCategory: PropTypes.oneOf(Object.values(ValidatorCategory)).isRequired,
}

export {
  DeleteValidationRuleButton,
}
