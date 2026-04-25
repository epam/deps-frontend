
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentType } from '@/actions/documentType'
import { useUpdateCrossFieldValidatorMutation } from '@/apiRTK/documentTypeApi'
import { Tooltip } from '@/components/Tooltip'
import { FieldBusinessRuleModal } from '@/containers/FieldBusinessRuleModal'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const EditBusinessRuleButton = ({
  renderTrigger,
  validatorId,
  validatorCategory,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const dispatch = useDispatch()
  const documentType = useSelector(documentTypeStateSelector)

  const [
    updateCrossFieldValidator,
    { isLoading },
  ] = useUpdateCrossFieldValidatorMutation()

  const toggleModal = () => {
    setIsModalVisible((prevState) => !prevState)
  }

  const {
    crossFieldValidators = [],
  } = documentType

  const fieldRule = crossFieldValidators.find((validator) => validator.id === validatorId)

  const submitRule = async (data) => {
    try {
      await updateCrossFieldValidator({
        documentTypeId: documentType.code,
        validatorId: fieldRule.id,
        data,
      }).unwrap()
      notifySuccess(localize(Localization.BUSINESS_RULE_UPDATED))
      dispatch(fetchDocumentType(documentType.code, [DocumentTypeExtras.VALIDATORS]))
      toggleModal()
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  if (validatorCategory === ValidatorCategory.VALIDATOR) {
    return (
      <Tooltip
        title={localize(Localization.BUSINESS_RULE_UPDATE_AVAILABLE_FOR_CROSS_FIELD_VALIDATION)}
      >
        {renderTrigger({ disabled: true })}
      </Tooltip>
    )
  }

  return (
    <>
      {
        renderTrigger({
          onClick: toggleModal,
        })
      }
      {
        isModalVisible && (
          <FieldBusinessRuleModal
            fieldRule={fieldRule}
            isLoading={isLoading}
            onCancel={toggleModal}
            onSubmit={submitRule}
            visible
          />
        )
      }
    </>
  )
}

EditBusinessRuleButton.propTypes = {
  renderTrigger: PropTypes.func.isRequired,
  validatorId: PropTypes.string.isRequired,
  validatorCategory: PropTypes.oneOf(Object.values(ValidatorCategory)).isRequired,
}

export {
  EditBusinessRuleButton,
}
