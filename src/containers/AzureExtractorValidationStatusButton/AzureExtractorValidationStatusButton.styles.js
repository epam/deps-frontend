
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { FaCircleCheckIcon } from '@/components/Icons/FaCircleCheckIcon'
import { FaRotateIcon } from '@/components/Icons/FaRotateIcon'
import { SpinnerIcon } from '@/components/Icons/SpinnerIcon'

const StyledButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.color.grayscale15};

  &:hover,
  &:focus  {
    border: 1px solid ${(props) => props.theme.color.grayscale15};
    box-shadow: none;
  }

  & > svg {
    width: 1.4rem;
    height: 2rem;
  }
`

const ErrorButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 1.2rem 2rem;
  border: 1px solid ${(props) => props.theme.color.errorLight};
  color: ${(props) => props.theme.color.error};
  font-weight: 600;

  &:hover,
  &:focus  {
    border: 1px solid ${(props) => props.theme.color.errorLight};
    color: ${(props) => props.theme.color.error};
    box-shadow: none;
  }

  & > svg {
    width: 1.4rem;
    height: 2rem;
    color: ${(props) => props.theme.color.error};
  }
`

const StyledFaCircleCheckIcon = styled(FaCircleCheckIcon)`
  color: ${(props) => props.theme.color.success};
`

const StyledFaRotateIcon = styled(FaRotateIcon)`
  color: ${(props) => props.theme.color.primary2};
`

const StyledSpinnerIcon = styled(SpinnerIcon)`
  color: ${(props) => props.theme.color.grayscale22};
`

export {
  StyledButton as Button,
  ErrorButton,
  StyledFaCircleCheckIcon as CircleCheckIcon,
  StyledFaRotateIcon as RotateIcon,
  StyledSpinnerIcon as SpinnerIcon,
}
