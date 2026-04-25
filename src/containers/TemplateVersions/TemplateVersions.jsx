
import {
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react'
import { useParams } from 'react-router'
import {
  fetchTemplateVersions,
  updateTemplateVersionName,
  fetchTemplateMarkupState,
} from '@/api/templatesApi'
import { LongText } from '@/components/LongText'
import { Table } from '@/components/Table'
import { ASYNC_OPERATION_STATE } from '@/enums/AsyncOperationState'
import { StatusCode } from '@/enums/StatusCode'
import { withParentSize } from '@/hocs/withParentSize'
import { localize, Localization } from '@/localization/i18n'
import { toLocalizedDateString } from '@/utils/dayjs'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import {
  notifyInfo,
  notifyWarning,
  notifyProgress,
} from '@/utils/notification'
import { goTo } from '@/utils/routerActions'
import { stringsSorter } from '@/utils/string'
import { openInNewTarget } from '@/utils/window'
import { TemplateNavHeader } from '../TemplateNavHeader'
import { TemplateVersionsRowCommands } from './TemplateVersionsRowCommands'
import { TemplateVersionTitle } from './TemplateVersionTitle'

const SizedTable = withParentSize({
  monitorHeight: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

const DataIndex = {
  NAME: 'name',
  DATE: 'createdAt',
  ID: 'id',
  DESCRIPTION: 'description',
}

const TABLE_ACTIONS_COLUMN_WIDTH = 32

const TemplateVersions = () => {
  const { id } = useParams()
  const [versions, setVersions] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [editableVersionId, setEditableVersionId] = useState('')

  const rowKey = (record) => record.id

  const getTemplateVersions = useCallback(async () => {
    if (!id) {
      return
    }

    try {
      setIsFetching(true)
      const templateVersions = await fetchTemplateVersions(id)
      setVersions(templateVersions)
    } catch (err) {
      if (err.response?.status === StatusCode.NOT_FOUND) {
        return goTo(navigationMap.error.notFound())
      }

      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsFetching(false)
    }
  }, [id])

  const updateVersionName = useCallback(async (name, versionRecord) => {
    if (name === versionRecord.name) {
      return setEditableVersionId('')
    }

    try {
      setIsFetching(true)
      setEditableVersionId('')

      await updateTemplateVersionName(
        id,
        {
          id: versionRecord.id,
          name,
        },
      )

      await getTemplateVersions()
    } catch (err) {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
      setEditableVersionId(versionRecord.id)
    } finally {
      setIsFetching(false)
    }
  }, [
    getTemplateVersions,
    id,
  ])

  useEffect(() => {
    getTemplateVersions()
  }, [
    getTemplateVersions,
  ])

  const columns = useMemo(() => ([{
    title: localize(Localization.TITLE),
    dataIndex: DataIndex.NAME,
    render: (name, record) => (
      <TemplateVersionTitle
        defaultTitle={name}
        isEditable={record.id === editableVersionId}
        placeholder={
          localize(Localization.TEMPLATE_VERSION_PLACEHOLDER).toLowerCase()
        }
        updateVersionName={(name) => updateVersionName(name, record)}
      />
    ),
    sorter: (a, b) => stringsSorter(a.name, b.name),
  },
  {
    title: localize(Localization.DATE),
    dataIndex: DataIndex.DATE,
    render: (createdAt) => (
      <LongText text={toLocalizedDateString(createdAt, true)} />
    ),
    sorter: (a, b) => stringsSorter(a.createdAt, b.createdAt),
  },
  {
    title: localize(Localization.DESCRIPTION),
    dataIndex: DataIndex.DESCRIPTION,
    render: (description) => (
      <LongText text={description} />
    ),
    sorter: (a, b) => stringsSorter(a.description, b.description),
  },
  {
    dataIndex: DataIndex.ID,
    render: (versionId) => (
      <TemplateVersionsRowCommands
        refreshTable={getTemplateVersions}
        setEditableVersionId={setEditableVersionId}
        templateId={id}
        versionId={versionId}
      />
    ),
    width: TABLE_ACTIONS_COLUMN_WIDTH,
    disableResize: true,
  },
  ]), [
    editableVersionId,
    getTemplateVersions,
    id,
    updateVersionName,
  ])

  const onRowClick = ({ id: versionId }) => ({
    onClick: async (event) => {
      if (!ENV.FEATURE_AUTO_LABELING) {
        return openInNewTarget(
          event,
          navigationMap.templates.labelingTool(id, versionId),
          () => goTo(navigationMap.templates.labelingTool(id, versionId)),
        )
      }

      let status, stopNotification
      try {
        stopNotification = notifyProgress(localize(Localization.AUTO_MARKUP_CHECKING))
        status = await fetchTemplateMarkupState(id)
      } catch (e) {
        notifyWarning(localize(Localization.DEFAULT_ERROR))
      } finally {
        stopNotification()
      }

      if (status === ASYNC_OPERATION_STATE.PROCESSING) {
        return notifyInfo(localize(Localization.AUTO_MARKUP_IN_PROGRESS))
      }

      openInNewTarget(
        event,
        navigationMap.templates.labelingTool(id, versionId),
        () => goTo(navigationMap.templates.labelingTool(id, versionId)),
      )
    },
  })

  return (
    <>
      <TemplateNavHeader
        getTemplateVersions={getTemplateVersions}
      />
      <SizedTable
        columns={columns}
        data={versions}
        fetching={isFetching}
        onRow={onRowClick}
        pagination
        rowKey={rowKey}
      />
    </>
  )
}

export {
  TemplateVersions,
}
