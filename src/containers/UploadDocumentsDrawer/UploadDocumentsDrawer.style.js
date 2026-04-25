
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'

export const StyledDrawer = styled(Drawer)`
  z-index: 1001;

  & .ant-drawer-footer {
    padding: 1rem 2.4rem;
  }
    
  .ant-drawer-title {
    color: ${(props) => props.theme.color.grayscale18};
  }
`

export const DrawerFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`

export const UploadButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const ContentWrapper = styled.div`
  display: flex;
  gap: 2.4rem;
`

export const ResetButton = styled(Button.Text)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${(props) => props.theme.color.primary2};
`

export const CancelButton = styled(Button.Secondary)`
  margin-left: auto;
`
