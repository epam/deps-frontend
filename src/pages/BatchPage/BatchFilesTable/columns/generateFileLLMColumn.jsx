import { SearchIcon } from '@/components/Icons/SearchIcon'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { DocumentLLMType } from '@/containers/DocumentLLMType'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { ColumnCode } from '../ColumnCode'

export const generateFileLLMColumn = (filterConfig) => {
  const filteredValue = filterConfig[ColumnCode.LLM_TYPE] || ''
  const sortOrder = filterConfig.sortField === ColumnCode.LLM_TYPE ? filterConfig.sortDirect : ''

  return ({
    dataIndex: ColumnCode.LLM_TYPE,
    key: ColumnCode.LLM_TYPE,
    filterDropdown: ({
      setSelectedKeys,
      confirm,
      visible,
    }) => (
      <TableSearchDropdown
        confirm={() => confirm({ closeDropdown: false })}
        onChange={setSelectedKeys}
        searchValue={filteredValue}
        visible={visible}
      />
    ),
    filterIcon: () => (
      <TableFilterIndicator
        active={!!filteredValue}
        icon={<SearchIcon />}
      />
    ),
    filteredValue,
    render: (llmType) => llmType && <DocumentLLMType llmType={llmType} />,
    sorter: (a, b) => stringsSorter(a[ColumnCode.LLM_TYPE], b[ColumnCode.LLM_TYPE]),
    sortOrder,
    title: localize(Localization.LLM_TYPE_UPPERCASE),
  })
}
