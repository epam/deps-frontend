
import { init } from '@elastic/apm-rum'
import { ENV } from '@/utils/env'
import { getUrlWithOrigin } from '@/utils/string'

const initializeElasticAPM = () => {
  if (
    ENV.ELASTIC_SERVER_URL &&
    ENV.ELASTIC_SERVICE_NAME &&
    ENV.ELASTIC_ENVIRONMENT &&
    ENV.ELASTIC_PROJECT_CODE
  ) {
    init({
      serviceName: ENV.ELASTIC_SERVICE_NAME,
      serverUrl: getUrlWithOrigin(ENV.ELASTIC_SERVER_URL),
      serviceVersion: '0.1.0',
      environment: ENV.ELASTIC_ENVIRONMENT,
    }).addLabels({ project: ENV.ELASTIC_PROJECT_CODE })
  }
}

export { initializeElasticAPM }
