
import styled from 'styled-components'
import { ExclamationCircleOutlinedIcon } from '@/components/Icons/ExclamationCircleOutlinedIcon'

const StyledExclamationCircleOutlinedIcon = styled(ExclamationCircleOutlinedIcon)`
  color: ${(props) => props.theme.color.warning};
  font-size: 2rem;
`

const ModalTitle = styled.span`
  margin-left: 0.5rem;
  line-height: 2rem;
  vertical-align: top;
`

export {
  StyledExclamationCircleOutlinedIcon as ExclamationCircleOutlinedIcon,
  ModalTitle,
}
