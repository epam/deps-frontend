
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentType } from '@/actions/documentType'
import { useCreateCrossFieldValidatorMutation } from '@/apiRTK/documentTypeApi'
import { Button, ButtonType } from '@/components/Button'
import { FieldBusinessRuleModal } from '@/containers/FieldBusinessRuleModal'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { PlusIcon } from './AddBusinessRule.styles'

const AddBusinessRule = ({ renderTrigger }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const dispatch = useDispatch()

  const documentType = useSelector(documentTypeStateSelector)

  const [
    createCrossFieldValidator,
    { isLoading },
  ] = useCreateCrossFieldValidatorMutation()

  const toggleModal = () => {
    setIsModalVisible((prevState) => !prevState)
  }

  const submitRule = async (data) => {
    try {
      await createCrossFieldValidator({
        documentTypeId: documentType.code,
        data,
      }).unwrap()
      notifySuccess(localize(Localization.BUSINESS_RULE_CREATED))
      dispatch(fetchDocumentType(documentType.code, [DocumentTypeExtras.VALIDATORS]))
      toggleModal()
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  const getTrigger = () => {
    const isDisabled = isLoading || !documentType.fields?.length

    if (renderTrigger) {
      return renderTrigger({
        disabled: isDisabled,
        onClick: toggleModal,
      })
    }

    return (
      <Button
        disabled={isDisabled}
        onClick={toggleModal}
        type={ButtonType.PRIMARY}
      >
        <PlusIcon />
        {localize(Localization.ADD_BUSINESS_RULE)}
      </Button>
    )
  }

  return (
    <>
      {getTrigger()}
      <FieldBusinessRuleModal
        isLoading={isLoading}
        onCancel={toggleModal}
        onSubmit={submitRule}
        visible={isModalVisible}
      />
    </>
  )
}

export {
  AddBusinessRule,
}

AddBusinessRule.propTypes = {
  renderTrigger: PropTypes.func,
}
