
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { SearchInput } from '@/containers/SearchInput'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 0 1.6rem;
    border: none;
  }
  
  .ant-drawer-body {
    padding: 2rem 1.6rem 0;
    scrollbar-gutter: stable;
  }

  .ant-drawer-footer {
    padding: 1.6rem;
    border: none;
  }
`

const StyledTitle = styled.div`
  padding: 1.6rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale16};
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const CancelButton = styled(Button.Secondary)`
  margin-right: 1.6rem;
`

const StyledSearchInput = styled(SearchInput)`
  margin-bottom: 2rem;
`

export {
  CancelButton,
  DrawerFooterWrapper,
  StyledDrawer as Drawer,
  StyledTitle as Title,
  StyledSearchInput as SearchInput,
}
