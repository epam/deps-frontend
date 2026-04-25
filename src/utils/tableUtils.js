
import { Localization, localize } from '@/localization/i18n'

const divider = localize(Localization.OF)
const items = localize(Localization.ITEMS)

const defaultShowTotal = (total, range) => (
  `${range[0]}-${range[1]} ${divider} ${total} ${items}`
)

const defaultPagination = {
  showSizeChanger: true,
  defaultPageSize: 10,
  showQuickJumper: true,
  showTotal: defaultShowTotal,
}

export {
  defaultShowTotal,
  defaultPagination,
}
