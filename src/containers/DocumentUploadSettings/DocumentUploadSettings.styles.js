
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { theme } from '@/theme/theme.default'

const StyledDrawer = styled(Drawer)`
  z-index: 900;

  && .ant-drawer-mask {
    animation: none;
  }

  & .ant-drawer-header-title {
    flex-direction: row-reverse;

    & > button {
      align-self: end;
    }
  }

  ${(props) => props.open && css`
    right: ${theme.size.drawerWidth};
  `}

  ${(props) => !props.open && css`
    opacity: 0;

    & .ant-drawer-mask {
      transition: none;
    }
  `}
`

const DrawerHeaderWrapper = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0;
`

const ResetButton = styled(Button)`
  font-size: 1.4rem;
  font-weight: 600;
  text-transform: capitalize;
  padding: 0;
`

const CheckboxWrapper = styled.div`
  display: inline-block;
  width: 50%;
  margin-bottom: 1.2rem;

  & > div {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;

    & span {
      font-size: 1.4rem;
      font-weight: 400;
    }

    & > label {
      margin-right: 0.5rem;
    }
  }
`

export {
  DrawerHeaderWrapper,
  DrawerFooterWrapper,
  ResetButton,
  StyledDrawer as Drawer,
  CheckboxWrapper,
}
