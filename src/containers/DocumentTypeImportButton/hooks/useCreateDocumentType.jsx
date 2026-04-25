
import {
  useCallback,
  useMemo,
} from 'react'
import { createDocumentType } from '@/api/documentTypesApi'
import { useCreatePrototypeMutation } from '@/apiRTK/prototypesApi'
import { ExtractionType } from '@/enums/ExtractionType'

const useCreateDocumentType = ({
  documentTypeDataRef,
  increaseRequestCount,
}) => {
  const [createPrototype] = useCreatePrototypeMutation()

  const onAfterCreate = useCallback((documentTypeId) => {
    documentTypeDataRef.current.documentTypeId = documentTypeId
    increaseRequestCount()
  }, [documentTypeDataRef, increaseRequestCount])

  const createPrototypeRequest = useCallback(async () => {
    const { name, engine, language, description } = documentTypeDataRef.current
    const { id } = await createPrototype({
      name,
      engine,
      language,
      description,
    }).unwrap()

    onAfterCreate(id)
  }, [
    createPrototype,
    documentTypeDataRef,
    onAfterCreate,
  ])

  const createAiPromptedExtractorRequest = useCallback(async () => {
    const { documentTypeId } = await createDocumentType({
      name: documentTypeDataRef.current.name,
      extractorType: ExtractionType.AI_PROMPTED,
    })
    onAfterCreate(documentTypeId)
  }, [documentTypeDataRef, onAfterCreate])

  const CREATE_DOCUMENT_TYPE_REQUEST = useMemo(() => ({
    [ExtractionType.PROTOTYPE]: createPrototypeRequest,
    [ExtractionType.AI_PROMPTED]: createAiPromptedExtractorRequest,
  }), [createPrototypeRequest, createAiPromptedExtractorRequest])

  return {
    CREATE_DOCUMENT_TYPE_REQUEST,
  }
}

export {
  useCreateDocumentType,
}
