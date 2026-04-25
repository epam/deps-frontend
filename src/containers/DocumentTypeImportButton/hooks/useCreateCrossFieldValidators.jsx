
import {
  useCallback,
  useRef,
  useState,
} from 'react'
import { usePolling } from 'use-raf-polling'
import { fetchDocumentType } from '@/api/documentTypesApi'
import { useCreateCrossFieldValidatorMutation } from '@/apiRTK/documentTypeApi'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { sendRequests } from '@/utils/sendRequests'
import { mapValidatorToRequest } from '../mappers'

const POLLING_INTERVAL = 3_000

const areAllFieldValidatorsCreated = (fieldsCodesMappingRef, validators) => {
  const fieldCodes = Object.values(fieldsCodesMappingRef)
  const validatorCodes = validators.map((validator) => validator.code)

  return fieldCodes.length === validatorCodes.length &&
  fieldCodes.every((code) => validatorCodes.includes(code))
}

const useCreateCrossFieldValidators = ({
  documentTypeDataRef,
  fieldsCodesMappingRef,
  increaseRequestCount,
}) => {
  const [shouldPollValidators, setShouldPollValidators] = useState(false)
  const [fetchedValidators, setFetchedValidators] = useState(null)
  const [createCrossFieldValidator] = useCreateCrossFieldValidatorMutation()

  const resolveCallbackRef = useRef(null)
  const rejectCallbackRef = useRef(null)

  const getValidators = useCallback(async () => {
    const { documentTypeId } = documentTypeDataRef.current
    const { validators } = await fetchDocumentType(documentTypeId, [DocumentTypeExtras.VALIDATORS])

    return validators
  }, [documentTypeDataRef])

  const sendCreationRequests = useCallback(async () => {
    const { documentTypeId, crossFieldValidators, genAIFields } = documentTypeDataRef.current

    const requests = crossFieldValidators.map((validator) => async () => {
      const data = mapValidatorToRequest(validator, genAIFields, fieldsCodesMappingRef.current)
      await createCrossFieldValidator({
        documentTypeId,
        data,
      }).unwrap()
      increaseRequestCount()
    })

    await sendRequests(requests, true)
  }, [
    createCrossFieldValidator,
    fieldsCodesMappingRef,
    documentTypeDataRef,
    increaseRequestCount,
  ])

  const onPollingSucceed = useCallback(async () => {
    try {
      await sendCreationRequests()
      resolveCallbackRef.current()
    } catch (e) {
      rejectCallbackRef.current(e)
    }
  }, [sendCreationRequests])

  const pollValidators = useCallback(async () => {
    try {
      const validators = await getValidators()
      setFetchedValidators(validators)
    } catch (e) {
      rejectCallbackRef.current(e)
      throw e
    }
  }, [getValidators])

  const areAllValidatorsCreated = useCallback(() => {
    if (!fetchedValidators) {
      return false
    }

    return areAllFieldValidatorsCreated(fieldsCodesMappingRef.current, fetchedValidators)
  }, [fieldsCodesMappingRef, fetchedValidators])

  usePolling({
    callback: pollValidators,
    condition: shouldPollValidators && !areAllValidatorsCreated(),
    interval: POLLING_INTERVAL,
    onPollingSucceed,
  })

  const createCrossFieldValidators = useCallback(async () => {
    const validators = await getValidators()
    const areValidatorsCreated = areAllFieldValidatorsCreated(fieldsCodesMappingRef.current, validators)

    if (areValidatorsCreated) {
      await sendCreationRequests()
      return
    }

    setShouldPollValidators(true)

    return new Promise((resolve, reject) => {
      resolveCallbackRef.current = resolve
      rejectCallbackRef.current = reject
    })
  }, [
    fieldsCodesMappingRef,
    getValidators,
    sendCreationRequests,
  ])

  return {
    createCrossFieldValidators,
  }
}

export {
  useCreateCrossFieldValidators,
}
