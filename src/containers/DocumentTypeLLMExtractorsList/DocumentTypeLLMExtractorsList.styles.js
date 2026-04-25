
import styled from 'styled-components'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'

const StyledNewPlusIcon = styled(NewPlusIcon)`
  margin-right: 1rem;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ExtractorsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  overflow: auto;

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.color.primary5};
  }
`

export {
  ExtractorsListWrapper,
  StyledNewPlusIcon as NewPlusIcon,
  Wrapper,
}
