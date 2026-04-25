
import { searchParamsToQueryString } from './queryString'

const documents = () => '/documents'
documents.path = () => documents() + '/:filterId'

const documentView = () => '/view'
documentView.path = () => documentView() + '/:documentId'

documents.document = (documentId, highlightedField) => {
  const searchParams = { highlightedField }
  return `${documentView()}/${documentId}${searchParamsToQueryString(searchParams)}`
}

const documentTypes = () => '/document-types'
documentTypes.documentType = (typeCode) => documentTypes() + '/' + typeCode
documentTypes.path = () => documentTypes() + '/:documentTypeCode'

const documentTypesGroups = () => '/document-types-groups'
documentTypesGroups.documentTypesGroup = (groupId) => documentTypesGroups() + '/' + groupId
documentTypesGroups.path = () => documentTypesGroups() + '/:groupId'

const batches = () => '/batches'
batches.batch = (id) => batches() + `/${id}`
batches.batch.path = () => batches() + '/:id'

const management = () => '/management'
management.template = () => management() + '/template'
management.user = () => management() + '/user'
management.organisationUsers = () => management() + '/organisationUsers'
management.waitingForApproval = () => management() + '/waitingForApproval'
management.invitees = () => management() + '/invitees'
management.source = () => management() + '/source'

const help = () => '/help'

const home = () => documents()

const labelingTool = () => '/labeling-tool'
labelingTool.document = (documentId) => `${documentView()}/${documentId}${labelingTool()}`
labelingTool.document.path = () => `${documentView()}/:documentId${labelingTool()}`

const notMatch = () => '*'
const base = () => '/'
const versions = () => '/versions'

const auth = () => '/authentication'
auth.silentRenew = () => auth() + '/silentRenew'
auth.signInCallback = () => auth() + '/signInCallback'
auth.signIn = () => auth() + '/signIn'

const error = () => '/error'
error.serviceUnavailable = () => error() + '/service-unavailable'
error.noUserOrganisation = () => error() + '/no-user-organisation'
error.missedCoreServices = () => error() + '/missed-core-services'
error.unauthorized = () => error() + '/unauthorized'
error.permissionDenied = () => error() + '/permission-denied'
error.notFound = () => error() + '/not-found'
error.rootNotFound = () => error() + '/root-not-found'

const waitingApproval = () => '/waiting-approval'

const join = () => '/join'
join.organisation = () => join() + '/:orgPk'

const templates = () => '/templates'
templates.template = (templateId) => templates() + '/' + templateId
templates.template.path = () => templates() + '/:id'

templates.labelingTool = (templateId, versionId) => templates.template(templateId) + '/version' + `/${versionId}`
templates.labelingTool.path = () => templates.template.path() + '/version' + '/:versionId'

const dashboard = () => '/dashboard'

const prototypes = () => '/prototypes'
prototypes.prototype = (prototypeId) => prototypes() + `/${prototypeId}`
prototypes.prototype.path = () => prototypes() + '/:id'
prototypes.createPrototype = () => prototypes() + '/new'

const files = () => '/source-files'
files.file = (fileId) => files() + `/${fileId}`
files.file.path = () => files() + '/:fileId'

export const navigationMap = {
  auth,
  base,
  batches,
  dashboard,
  documents,
  documentTypes,
  documentTypesGroups,
  documentView,
  error,
  help,
  home,
  join,
  labelingTool,
  management,
  notMatch,
  templates,
  versions,
  waitingApproval,
  prototypes,
  files,
}
