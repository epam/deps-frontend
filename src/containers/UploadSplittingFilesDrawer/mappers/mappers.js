
export const mapDataToBatchDTO = ({ formValues, uploadedData }) => ({
  name: formValues.batchName,
  groupId: formValues.group?.id,
  files: uploadedData.map(({
    path,
    name,
    documentTypeId,
  }) => ({
    name,
    path,
    documentTypeId: documentTypeId ?? null,
    processingParams: {
      engine: formValues.engine,
      llmType: formValues.llmType,
      parsingFeatures: formValues.parsingFeatures,
    },
  })),
})
