
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentType } from '@/actions/documentType'
import {
  useDeleteCrossFieldValidatorMutation,
  useDeleteValidatorRuleMutation,
} from '@/apiRTK/documentTypeApi'
import { Modal } from '@/components/Modal'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { ConfirmContent } from './DeleteValidationRuleButton.styles'

const CONFIRMATION_CONFIG = {
  [ValidatorCategory.VALIDATOR]: (fieldNames) => ({
    title: localize(Localization.DELETE_VALIDATION_RULE_CONFIRM_TITLE),
    content: (
      <ConfirmContent>
        {localize(Localization.DELETE_VALIDATION_RULE_CONFIRM) + ' '}
        <span>{fieldNames[0]}</span>
        {'?'}
      </ConfirmContent>
    ),
  }),
  [ValidatorCategory.CROSS_FIELD_VALIDATOR]: (fieldNames) => ({
    title: localize(Localization.DELETE_CROSS_FIELD_VALIDATION_RULE_CONFIRM_TITLE),
    content: (
      <ConfirmContent>
        {localize(Localization.DELETE_CROSS_FIELD_VALIDATION_RULE_CONFIRM) + ' '}
        <span>{fieldNames.join('; ')}</span>
      </ConfirmContent>
    ),
  }),
}

const useDeleteValidationRuleAction = () => {
  const dispatch = useDispatch()
  const documentType = useSelector(documentTypeStateSelector)
  const [deleteCrossFieldValidator] = useDeleteCrossFieldValidatorMutation()
  const [deleteValidatorRule] = useDeleteValidatorRuleMutation()

  const refetchValidators = useCallback(async () => {
    dispatch(fetchDocumentType(
      documentType.code,
      [DocumentTypeExtras.VALIDATORS],
    ))
  }, [
    documentType.code,
    dispatch,
  ])

  const deleteHandlers = useMemo(() => ({
    [ValidatorCategory.VALIDATOR]: ({ validatorId, ruleName }) => deleteValidatorRule({
      documentTypeId: documentType.code,
      validatorCode: validatorId,
      ruleName,
    }),
    [ValidatorCategory.CROSS_FIELD_VALIDATOR]: ({ validatorId }) => deleteCrossFieldValidator({
      documentTypeId: documentType.code,
      validatorId,
    }),
  }), [
    deleteValidatorRule,
    deleteCrossFieldValidator,
    documentType.code,
  ])

  const handleDelete = async ({
    ruleName,
    validatorId,
    validatorCategory,
  }) => {
    const deleteFunc = deleteHandlers[validatorCategory]

    try {
      await deleteFunc({
        ruleName,
        validatorId,
      }).unwrap()
      notifySuccess(localize(Localization.VALIDATION_RULE_SUCCESS_DELETION, { ruleName }))
      await refetchValidators()
    } catch (e) {
      const errorCode = e.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  const confirmAndDeleteValidationRule = ({
    fieldNames,
    ruleName,
    validatorCategory,
    validatorId,
  }) => {
    const confirmationConfig = CONFIRMATION_CONFIG[validatorCategory]

    Modal.confirm({
      ...confirmationConfig(fieldNames),
      onOk: () => handleDelete({
        ruleName,
        validatorId,
        validatorCategory,
      }),
    })
  }

  return {
    confirmAndDeleteValidationRule,
  }
}

export {
  useDeleteValidationRuleAction,
}
