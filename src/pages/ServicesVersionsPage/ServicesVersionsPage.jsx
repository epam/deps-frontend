
import { ApplicationLogo } from '@/containers/ApplicationLogo'
import { localize, Localization } from '@/localization/i18n'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'
import {
  ServicesVersionsWrapper,
  ServicesVersionsHeader,
  ServicesVersionsContentWrapper,
  ServicesVersionsContentHeader,
  ServicesVersionsContent,
  Line,
} from './ServicesVersionsPage.styles'
import { ServiceVersionCard } from './ServiceVersionCard'

const ServicesBE = {
  IMAGE_PREPROCESS: 'Image Preprocess',
  NER: 'Named Entity Recognition',
  DOCUMENT_TYPE: 'Document Type',
  EXTRACTION: 'Extraction',
  UNIFIER: 'Unifier',
  RESULT_EXPORTING: 'Result Exporting',
  PROTOTYPE: 'Prototype',
  METRIC_COLLECTOR: 'Metric Collector',
  EXTRACTION_INVOICE: 'Extraction Invoice',
  NGINX: 'Nginx',
  PLAYGROUND: 'Playground',
  GENERIC_UNIFIER_PLUGIN: 'Generic Unifier Plugin',
  ALL_FIELDS_QA: 'All Fields QA',
  ALL_FIELDS_QA_VALIDATION: 'All Fields QA Validation',
}

const ServicesFE = {
  FRONTEND: 'Frontend',
  FRONTEND_CUSTOMIZATION: 'Frontend Customization',
  BACKEND: 'Backend',
  TABLES: 'Tables',
  PREPROCESS: 'Preprocess',
  OCR: 'OCR',
  IAM: 'IAM',
  OMR: 'OMR',
  FILE_STORAGE: 'File storage',
  TEMPLATE: 'Template',
  WORKFLOW_MANAGER: 'Workflow Manager',
  OUTPUT_EXPORTING: 'Output Exporting',
  PARSING: 'Parsing',
  API_GATEWAY: 'API Gateway',
  PROMPTER: 'Prompter',
}

const servicesVersionsApiRequests = {
  [ServicesFE.OCR]: () => apiRequest.get(apiMap.ocr.version),
  [ServicesFE.BACKEND]: () => apiRequest.get(apiMap.backend.version),
  [ServicesFE.TABLES]: () => apiRequest.get(apiMap.tables.version),
  [ServicesFE.PREPROCESS]: () => apiRequest.get(apiMap.preprocess.version),
  [ServicesFE.OMR]: () => apiRequest.get(apiMap.omr.version),
  [ServicesFE.FILE_STORAGE]: () => apiRequest.get(apiMap.fileStorage.version),
  [ServicesFE.IAM]: () => apiRequest.get(apiMap.iam.version),
  [ServicesFE.TEMPLATE]: () => apiRequest.get(apiMap.template.version),
  [ServicesFE.WORKFLOW_MANAGER]: () => apiRequest.get(apiMap.workflowManager.version),
  [ServicesFE.OUTPUT_EXPORTING]: () => apiRequest.get(apiMap.outputExporting.version),
  [ServicesFE.PARSING]: () => apiRequest.get(apiMap.parsing.version),
  [ServicesFE.API_GATEWAY]: () => apiRequest.get(apiMap.apiGateway.version),
  [ServicesBE.DOCUMENT_TYPE]: () => apiRequest.get(apiMap.documentType.version),
  [ServicesBE.IMAGE_PREPROCESS]: () => apiRequest.get(apiMap.imagePreprocess.version),
  [ServicesBE.EXTRACTION]: () => apiRequest.get(apiMap.extraction.version),
  [ServicesBE.UNIFIER]: () => apiRequest.get(apiMap.unifier.version),
  [ServicesBE.RESULT_EXPORTING]: () => apiRequest.get(apiMap.resultExporting.version),
  [ServicesBE.PROTOTYPE]: () => apiRequest.get(apiMap.prototype.version),
  [ServicesBE.NER]: () => apiRequest.get(apiMap.ner.version),
  [ServicesFE.PROMPTER]: () => apiRequest.get(apiMap.prompter.version),
}

const ServicesVersionsPage = () => {
  const servicesVersionsRender = (services) => (
    Object.entries(services).map(([serviceKey, serviceValue]) => (
      <ServiceVersionCard
        key={serviceKey}
        apiRequest={servicesVersionsApiRequests[serviceValue]}
        serviceName={services[serviceKey]}
      />
    ))
  )

  return (
    <ServicesVersionsWrapper>
      <ServicesVersionsHeader>
        <ApplicationLogo />
      </ServicesVersionsHeader>
      <ServicesVersionsContentWrapper>
        <ServicesVersionsContentHeader>
          {localize(Localization.VERSION_HEADER)}
        </ServicesVersionsContentHeader>
        <ServicesVersionsContent>
          {
            servicesVersionsRender(ServicesFE)
          }
        </ServicesVersionsContent>
        <Line />
        <ServicesVersionsContent>
          {
            servicesVersionsRender(ServicesBE)
          }
        </ServicesVersionsContent>
      </ServicesVersionsContentWrapper>
    </ServicesVersionsWrapper>
  )
}

export {
  ServicesVersionsPage,
}
