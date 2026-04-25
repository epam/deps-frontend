
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { DocumentIcon } from '@/components/Icons/DocumentIcon'
import { ListIcon } from '@/components/Icons/ListIcon'

const iconWrapper = css`
  display: flex;
  align-items: center;
  height: 100%;

  & > svg {
    width: 2rem;
    height: 2rem;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  max-height: 6.5rem;
  padding: 0 1.6rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
`

const Title = styled.h4`
  min-width: 8rem;
  margin: 0;
  font-weight: 600;
  line-height: 2.4rem;
`

const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const AddLayoutButton = styled(Button)`
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 1.2rem;
`

const KeyValueViewIcon = styled(ListIcon)`
  ${iconWrapper}
`

const DocumentViewIcon = styled(DocumentIcon)`
  ${iconWrapper}
`

export {
  Header,
  HeaderCell,
  AddLayoutButton,
  Title,
  KeyValueViewIcon,
  DocumentViewIcon,
}
