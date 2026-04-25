
import styled from 'styled-components'
import { ErrorCircleIcon } from '@/components/Icons/ErrorCircleIcon'
import { ErrorTriangleIcon } from '@/components/Icons/ErrorTriangleIcon'
import { FieldValidationMessage } from '@/containers/FieldAdapter/FieldValidationMessage'

const ErrorIcon = styled(ErrorCircleIcon)`
  color: ${(props) => props.theme.color.error};
  cursor: pointer;
`

const WarningIcon = styled(ErrorTriangleIcon)`
  color: ${(props) => props.theme.color.warning};
  cursor: pointer;
`

const ValidationMessagesList = styled.ul`
  display: list-item;
`

const ValidationMessageItem = styled.li`
  list-style-type: disc;
  margin-left: 2rem;
`

const ValidationMessage = styled(FieldValidationMessage)`
  color: ${(props) => props.theme.color.primary3};
  font-size: 1.4rem;
`

export {
  ErrorIcon,
  WarningIcon,
  ValidationMessagesList,
  ValidationMessageItem,
  ValidationMessage,
}
