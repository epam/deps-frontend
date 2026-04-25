
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { ErrorCircleIcon } from '@/components/Icons/ErrorCircleIcon'
import { ErrorTriangleIcon } from '@/components/Icons/ErrorTriangleIcon'

const Wrapper = styled.div`
  margin-top: 0.5rem;
`

const ItemWrapper = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
`

const ItemIndex = styled.span`
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.2rem;
  padding: 0 0.3rem;
  margin-right: 0.3rem;
`

const ErrorIcon = styled(ErrorCircleIcon)`
  color: ${(props) => props.theme.color.error};
  margin: 0 0.5rem;
  min-width: 1.4rem;
`

const WarningIcon = styled(ErrorTriangleIcon)`
  color: ${(props) => props.theme.color.warning};
  margin: 0 0.5rem;
  min-width: 1.4rem;
`

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.2rem;
`

const StyledButton = styled(Button.Link)`
  margin-left: 1.8rem;
  text-decoration: none;
`

export {
  ItemWrapper,
  ItemIndex,
  ErrorIcon,
  WarningIcon,
  ButtonContent,
  StyledButton as Button,
  Wrapper,
}
