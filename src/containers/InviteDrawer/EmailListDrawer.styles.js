
import styled from 'styled-components'
import { Drawer as DrawerComponent } from '@/components/Drawer'
import { Input } from '@/components/Input'

const StyledDescription = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.color.grayscale5};
`

const StyledTextArea = styled(Input.TextArea)`
  border: 0.1rem solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.4rem;
  resize: none;
  flex: 1;
  `

const Drawer = styled(DrawerComponent)`
  .ant-drawer-body {
    display: flex;
    flex-direction: column;
  }

  .ant-drawer-footer {
    border: none;
    padding: 0 2.4rem 1.6rem;
  }
`

const ControlWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export {
  StyledTextArea,
  StyledDescription,
  Drawer,
  ControlWrapper,
}
