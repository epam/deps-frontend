
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { clearDocumentTypeStore, fetchDocumentType } from '@/actions/documentType'
import { changeActiveTab } from '@/actions/documentTypePage'
import { Content } from '@/components/Layout'
import { Spin } from '@/components/Spin'
import { Tab } from '@/components/Tabs'
import { DocumentTypeBusinessRulesList } from '@/containers/DocumentTypeBusinessRulesList'
import { DocumentTypeFieldsList } from '@/containers/DocumentTypeFieldsList'
import { DocumentTypeLLMExtractorsList } from '@/containers/DocumentTypeLLMExtractorsList'
import { DocumentTypeOutputProfilesList } from '@/containers/DocumentTypeOutputProfilesList'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { StatusCode } from '@/enums/StatusCode'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { activeTabSelector } from '@/selectors/documentTypePage'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { DocumentTypeHeader } from './DocumentTypeHeader'
import { Tabs } from './DocumentTypeViewPage.styles'

const TAB_KEY = {
  fields: 'fields',
  outputProfiles: 'outputProfiles',
  llmExtractors: 'llmExtractors',
  businessRules: 'businessRules',
}

const allExtras = [
  DocumentTypeExtras.EXTRACTION_FIELDS,
  DocumentTypeExtras.VALIDATORS,
  ...(ENV.FEATURE_ENRICHMENT ? [DocumentTypeExtras.EXTRA_FIELDS] : []),
  ...(ENV.FEATURE_OUTPUT_PROFILES ? [DocumentTypeExtras.PROFILES] : []),
  ...(ENV.FEATURE_LLM_EXTRACTORS ? [DocumentTypeExtras.LLM_EXTRACTORS] : []),
  DocumentTypeExtras.WORKFLOW_CONFIGURATIONS,
]

const DocumentTypeViewPage = () => {
  const { documentTypeCode } = useParams()

  const [isDocumentTypeFetching, setIsDocumentTypeFetching] = useState(true)

  const documentType = useSelector(documentTypeStateSelector)
  const activeTabKey = useSelector(activeTabSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    const getDocumentType = async () => {
      try {
        await dispatch(fetchDocumentType(documentTypeCode, allExtras))
      } catch (err) {
        if (err.response?.status === StatusCode.NOT_FOUND) {
          return goTo(navigationMap.error.notFound())
        }
      } finally {
        setIsDocumentTypeFetching(false)
      }
    }

    getDocumentType()

    return () => {
      dispatch(clearDocumentTypeStore())
      dispatch(changeActiveTab(null))
    }
  }, [
    dispatch,
    documentTypeCode,
  ])

  const tabs = useMemo(() => {
    const tabs = []

    tabs.push(
      new Tab(
        TAB_KEY.fields,
        localize(Localization.FIELDS_TITLE),
        <DocumentTypeFieldsList />,
      ),
    )

    if (ENV.FEATURE_OUTPUT_PROFILES) {
      tabs.push(
        new Tab(
          TAB_KEY.outputProfiles,
          localize(Localization.OUTPUT_PROFILES),
          <DocumentTypeOutputProfilesList />,
        ),
      )
    }

    if (ENV.FEATURE_VALIDATION_BUSINESS_RULES) {
      tabs.push(
        new Tab(
          TAB_KEY.businessRules,
          localize(Localization.BUSINESS_RULES),
          <DocumentTypeBusinessRulesList />,
        ),
      )
    }

    if (ENV.FEATURE_LLM_EXTRACTORS) {
      tabs.push(
        new Tab(
          TAB_KEY.llmExtractors,
          localize(Localization.LLM_EXTRACTORS),
          <DocumentTypeLLMExtractorsList />,
        ),
      )
    }

    return tabs
  }, [])

  const onChangeActiveKey = (key) => {
    dispatch(changeActiveTab(key))
  }

  if (isDocumentTypeFetching) {
    return (
      <Spin.Centered spinning />
    )
  }

  return (
    <Content>
      <DocumentTypeHeader
        documentType={documentType}
      />
      <Tabs
        activeKey={activeTabKey ?? tabs[0]?.key}
        onChange={onChangeActiveKey}
        tabs={tabs}
      />
    </Content>
  )
}

export {
  DocumentTypeViewPage,
}
