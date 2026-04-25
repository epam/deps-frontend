
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
import { enumToOptions } from '@/components/Select'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { LongTagsList } from '@/containers/LongTagsList'
import { KnownParsingFeature, RESOURCE_PARSING_FEATURE } from '@/enums/KnownParsingFeature'
import { Localization, localize } from '@/localization/i18n'
import { Tag } from '@/models/Tag'
import { ColumnCode } from '../ColumnCode'

const CELL_OFFSET = 20

export const generateFileParsingFeaturesColumn = (filterConfig) => {
  const filteredValue = filterConfig[ColumnCode.PARSING_FEATURES]
  const options = enumToOptions(KnownParsingFeature, RESOURCE_PARSING_FEATURE)

  return {
    filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
      <TableSelectFilter
        confirm={confirm}
        options={options}
        selectedKeys={filteredValue}
        setSelectedKeys={setSelectedKeys}
        visible={visible}
      />
    ),
    filterIcon: () => (
      <TableFilterIndicator
        active={!!filteredValue?.length}
      />
    ),
    filteredValue,
    key: ColumnCode.PARSING_FEATURES,
    title: localize(Localization.PARSING_FEATURES),
    dataIndex: ColumnCode.PARSING_FEATURES,
    render: (features) => features?.length && (
      <LongTagsList
        icon={<LayerGroupIcon />}
        offset={CELL_OFFSET}
        tags={
          features.map((feature) => new Tag({
            id: feature,
            text: RESOURCE_PARSING_FEATURE[feature],
          }))
        }
      />
    ),
    sorter: false,
  }
}
