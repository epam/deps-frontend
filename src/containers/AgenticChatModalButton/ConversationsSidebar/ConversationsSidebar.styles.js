
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { PenToSquareIcon } from '@/components/Icons/PenToSquareIcon'

const Wrapper = styled.div`
  border-right: 1px solid ${(props) => props.theme.color.grayscale15};
  padding: 2rem 1.6rem;
  width: 28.7rem;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`

const NewConversationIcon = styled(PenToSquareIcon)`
  margin-right: 8px;
  path {
    fill: ${({ theme }) => theme.color.grayscale11};
  }
`

const NewConversationButton = styled(Button.Text)`
  padding: 0;
  color: ${({ theme }) => theme.color.grayscale12};
    
  &:focus {
    color: ${({ theme }) => theme.color.grayscale12};   
  }
`

export {
  Wrapper,
  NewConversationButton,
  NewConversationIcon,
}
