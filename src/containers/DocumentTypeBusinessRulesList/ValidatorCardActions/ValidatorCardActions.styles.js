
import styled from 'styled-components'
import { TableActionIcon } from '@/components/TableActionIcon'

const ActionIcon = styled(TableActionIcon)`
  svg {
    path {
      fill: ${(props) => props.theme.color.grayscale12};
    }
  }
`

export {
  ActionIcon,
}
