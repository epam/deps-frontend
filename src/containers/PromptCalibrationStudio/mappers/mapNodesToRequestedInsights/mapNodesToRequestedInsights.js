
import { mapFieldToResponseModel } from '../mapFieldToResponseModel'

export const mapNodesToRequestedInsights = (field, nodes) => {
  const responseModel = mapFieldToResponseModel(
    field.fieldType,
    field.multiplicity,
    { includeAliases: field.aliases },
  )

  return {
    [field.id]: {
      workflow: {
        prompts: nodes.map((node) => ({
          content: node.prompt,
        })),
        responseModel,
      },
    },
  }
}
