
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { WarningTriangleIcon } from '@/components/Icons/WarningTriangleIcon'

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
  justify-content: space-between;
  gap: 1.6rem;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`

export const UploadButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const ErrorMessageWrapper = styled.p`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
`

export const ErrorIcon = styled(WarningTriangleIcon)`
  flex-shrink: 0;
  fill: ${(props) => props.theme.color.error};
  margin-bottom: 0.3rem;
`
