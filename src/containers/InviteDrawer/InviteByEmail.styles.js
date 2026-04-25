
import styled from 'styled-components'
import { Button } from '@/components/Button'

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 0.8rem;
`

const InviteWrapper = styled.div`
  max-height: 40rem;
  display: flex;
  align-items: end;
  flex-direction: column;
`

const ControlWrapper = styled.div`
  width: 100%; 
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.2rem;
`

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  width: 100%;
`

const StyledListEmailsButton = styled(Button)`
  width: 3.2rem;
  padding: 0.5rem 0 0;
`

const StyledAddEmailButton = styled(Button)`
  width: 3.2rem;
  padding: 0;

  &:disabled {
    pointer-events: none;
  }
`

const EmailsList = styled.div` 
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.8rem;
  border: 0.1rem solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.4rem;
  overflow: auto;
`

const Hint = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.color.grayscale16};
  margin-bottom: 1.6rem;
`

export {
  InputWrapper,
  InviteWrapper,
  ControlWrapper,
  ButtonsWrapper,
  StyledListEmailsButton,
  StyledAddEmailButton,
  EmailsList,
  Hint,
}
