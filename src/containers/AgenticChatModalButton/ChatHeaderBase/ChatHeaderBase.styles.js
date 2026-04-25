
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { PenToSquareIcon } from '@/components/Icons/PenToSquareIcon'

const Wrapper = styled.div`
  flex-shrink: 0;
  width: 100%;
  display: flex;
  gap: 1.6rem;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayscale15};
`

const StartNewChatIcon = styled(PenToSquareIcon)`
  path {
    fill: ${({ theme }) => theme.color.primary2};
  }
`

const StartNewChatButton = styled(Button.Icon)`
  padding: 5px;
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.6rem;
  flex-grow: 1;
`

export {
  Wrapper,
  StartNewChatIcon,
  StartNewChatButton,
  Actions,
}
