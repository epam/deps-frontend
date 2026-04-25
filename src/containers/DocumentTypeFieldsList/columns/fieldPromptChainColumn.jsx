
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { Localization, localize } from '@/localization/i18n'
import { FieldColumn } from '../FieldColumn'
import { PromptChainCell } from '../PromptChainCell'

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

const onFilter = (value, record) => {
  const chain = record[FieldColumn.PROMPT_CHAIN] ?? []
  const search = value.toLowerCase()

  if (chain.length === 1) {
    const [node] = chain
    return node.prompt.toLowerCase().includes(search)
  }

  return chain.some((node) => {
    const prompt = node?.prompt.toLowerCase() ?? ''
    const name = node?.name.toLowerCase() ?? ''
    return prompt.includes(search) || name.includes(search)
  })
}

const generateFieldPromptChainColumn = () => ({
  title: localize(Localization.PROMPTS),
  dataIndex: FieldColumn.PROMPT_CHAIN,
  render: (promptChain) => promptChain && (
    <PromptChainCell
      promptChain={promptChain}
    />
  ),
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
  onFilter,
})

export {
  generateFieldPromptChainColumn,
}
