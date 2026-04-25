
import PropTypes from 'prop-types'

class AzureCredentials {
  constructor ({
    apiKey,
    endpoint,
    modelId,
  }) {
    this.apiKey = apiKey
    this.endpoint = endpoint
    this.modelId = modelId
  }
}

const azureCredentialsShape = PropTypes.shape({
  apiKey: PropTypes.string,
  endpoint: PropTypes.string,
  modelId: PropTypes.string,
})

class AzureExtractor {
  constructor ({
    credentials,
    name,
  }) {
    this.credentials = credentials
    this.name = name
  }
}

const azureExtractorShape = PropTypes.shape({
  name: PropTypes.string,
  credentials: azureCredentialsShape,
})

export {
  AzureCredentials,
  AzureExtractor,
  azureCredentialsShape,
  azureExtractorShape,
}
