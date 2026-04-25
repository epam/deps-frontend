
import styled from 'styled-components'
import { CommandBar } from '@/components/CommandBar'

const DocumentTableCommandsBar = styled(CommandBar)`
  gap: 1.6rem;
`

const Separator = styled.div`
  width: 1px;
  background-color: ${(props) => props.theme.color.grayscale1};
  height: 100%;
  margin: 0 1.2rem;
`

export {
  DocumentTableCommandsBar,
  Separator,
}
