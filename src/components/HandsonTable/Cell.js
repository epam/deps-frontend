
import { theme } from '@/theme/theme.default'

const renderCell = (td, value, { readOnly }, extra) => {
  readOnly && (td.style.color = theme.color.grayScale8)
  td.textContent = value
  extra && td.appendChild(extra)
  return td
}

export {
  renderCell,
}
