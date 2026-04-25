
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { EditControlPanel } from '@/containers/EditControlPanel'

const EditButton = styled(Button)`
  margin-left: auto;
  font-weight: 600;
  padding: 0 2rem;
`

const Controls = styled(EditControlPanel)`
  margin-left: auto;
`

export {
  Controls,
  EditButton,
}
