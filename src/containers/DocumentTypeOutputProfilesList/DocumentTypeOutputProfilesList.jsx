
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentType } from '@/actions/documentType'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { LongText } from '@/components/LongText'
import { Spin } from '@/components/Spin'
import { Table } from '@/components/Table'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { AddOutputProfileModalButton } from '@/containers/AddOutputProfileModalButton'
import { EmptyState } from '@/containers/EmptyState'
import { InfoPanel } from '@/containers/InfoPanel'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { RESOURCE_OUTPUT_PROFILE_TYPE } from '@/enums/OutputProfileType'
import { withParentSize } from '@/hocs/withParentSize'
import { Localization, localize } from '@/localization/i18n'
import { OutputProfile } from '@/models/OutputProfile'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { isDocumentTypeFetchingSelector } from '@/selectors/requests'
import { stringsSorter } from '@/utils/string'
import {
  ActionWrapper,
  Tooltip,
  Wrapper,
} from './DocumentTypeOutputProfilesList.styles'
import { OutputProfilesCommandBar } from './OutputProfilesCommandBar'

const SizeAwareTable = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

const DataIndex = {
  NAME: 'name',
}

const getType = (profile) => {
  if (OutputProfile.isPlugin(profile)) {
    return localize(Localization.PLUGIN)
  }

  return RESOURCE_OUTPUT_PROFILE_TYPE[
    OutputProfile.getOutputProfileTypeBySchema(profile)
  ]
}

const onFilterChange = (
  val,
  {
    clearFilters,
    setSelectedKeys,
  },
) => {
  if (val) {
    return setSelectedKeys([val])
  }

  setSelectedKeys([])
  clearFilters()
}

const COLUMN_WIDTH = 21

const getColumns = (documentType, total, refreshTable) => [{
  title: localize(Localization.NAME),
  dataIndex: DataIndex.NAME,
  render: (name) => <LongText text={name} />,
  sorter: (a, b) => stringsSorter(a.name, b.name),
  filterDropdown: ({
    confirm,
    selectedKeys,
    visible,
    ...restFilterProps
  }) => (
    <TableSearchDropdown
      confirm={() => confirm({ closeDropdown: false })}
      onChange={(val) => onFilterChange(val, restFilterProps)}
      searchValue={selectedKeys[0]}
      visible={visible}
    />
  ),
  filterIcon: (filtered) => (
    <TableFilterIndicator
      active={filtered}
      icon={<SearchIcon />}
    />
  ),
  onFilter: (value, record) => (
    record[DataIndex.NAME]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase())
  ),
}, {
  title: localize(Localization.TYPE),
  render: getType,
  sorter: (a, b) => stringsSorter(getType(a), getType(b)),
}, {
  title: '',
  render: (_, record) => (
    <OutputProfilesCommandBar
      documentType={documentType}
      profile={record}
      refreshTable={refreshTable}
      total={total}
    />
  ),
  width: COLUMN_WIDTH,
  disableResize: true,
}]

const PROFILES_LIMIT = 10

const DocumentTypeOutputProfilesList = () => {
  const documentType = useSelector(documentTypeStateSelector)
  const isLoading = useSelector(isDocumentTypeFetchingSelector)
  const dispatch = useDispatch()

  const { profiles } = documentType
  const total = profiles?.length

  const refetchProfiles = useCallback(() => {
    dispatch(fetchDocumentType(
      documentType.code,
      [DocumentTypeExtras.PROFILES],
    ))
  }, [
    documentType.code,
    dispatch,
  ])

  const AddProfileButton = useMemo(() => {
    const isProfilesLimitReached = profiles?.length >= PROFILES_LIMIT

    const button = (
      <AddOutputProfileModalButton
        disabled={isProfilesLimitReached}
      />
    )

    if (isProfilesLimitReached) {
      return (
        <Tooltip title={localize(Localization.PROFILES_LIMIT)}>
          {button}
        </Tooltip>
      )
    }

    return button
  }, [profiles])

  const renderActions = () => (
    <ActionWrapper>
      {AddProfileButton}
    </ActionWrapper>
  )

  const rowKey = (record) => record.id

  if (isLoading) {
    return <Spin.Centered spinning />
  }

  if (!total) {
    return (
      <EmptyState title={localize(Localization.OUTPUT_PROFILES_WERE_NOT_FOUND)} />
    )
  }

  return (
    <Wrapper>
      <InfoPanel
        fetching={isLoading}
        renderActions={renderActions}
        total={total}
      />
      <SizeAwareTable
        columns={getColumns(documentType, total, refetchProfiles)}
        data={profiles}
        fetching={isLoading}
        pagination={false}
        rowKey={rowKey}
      />
    </Wrapper>
  )
}

export {
  DocumentTypeOutputProfilesList,
}
