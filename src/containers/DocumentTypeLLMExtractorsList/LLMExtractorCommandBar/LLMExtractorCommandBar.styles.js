
import styled from 'styled-components'
import { CommandBar } from '@/components/CommandBar'
import { TableActionIcon } from '@/components/TableActionIcon'

const StyledTableActionIcon = styled(TableActionIcon)`
  svg {
    path {
      fill: ${(props) => props.theme.color.grayscale12};
    }
  }
`

const StyledCommandBar = styled(CommandBar)`
  display: flex;
  justify-content: center;
  gap: 1.6rem;
`

export {
  StyledCommandBar as CommandBar,
  StyledTableActionIcon as TableActionIcon,
}
