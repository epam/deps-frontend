
import styled from 'styled-components'
import { Button } from '@/components/Button'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  height: 5.6rem;
  padding: 1.2rem 1.6rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 8px 8px 0 0;
`

const Logo = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.theme.color.grayscale21};
  border-radius: 4rem;
`

const ActionButton = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.4rem;
`

const ModalTitle = styled.div`
  color: ${(props) => props.theme.color.grayscale18};
  flex-grow: 1;
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.2rem;
`

export {
  ActionButton,
  Logo,
  ModalTitle,
  Wrapper,
}
