
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { CubeIcon } from '@/components/Icons/CubeIcon'
import { FaRotateIcon } from '@/components/Icons/FaRotateIcon'
import { LongText } from '@/components/LongText'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1.6rem;
  height: 5.6rem;
  padding: 1.6rem;
  background-color: ${(props) => props.theme.color.grayscale14};
`

const Message = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  line-height: 2.2rem;
`

const Title = styled.span`
  color: ${(props) => props.theme.color.error};
  font-weight: 600;
`

const Description = styled(LongText)`
  color: ${(props) => props.theme.color.grayscale18};
  font-weight: 400;
`

const StyledButton = styled(Button)`
  width: 2.4rem;
  height: 2.4rem;
  border: none;
  background-color: transparent;
  box-shadow: none;
  
  &:hover,
  &:focus  {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
`

const RetryIcon = styled(FaRotateIcon)`
  color: ${(props) => props.theme.color.primary2};
  width: 1.4rem;
  height: 2rem;
`

const ErrorIcon = styled(CubeIcon)`
  color: ${(props) => props.theme.color.error};
`

export {
  Wrapper,
  Message,
  Title,
  Description,
  StyledButton as Button,
  ErrorIcon,
  RetryIcon,
}
