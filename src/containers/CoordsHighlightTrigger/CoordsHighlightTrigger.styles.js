
import styled, { css } from 'styled-components'
import { Badge } from '@/components/Badge'
import { CustomMenu } from '@/components/Menu/CustomMenu'

const Wrapper = styled.div`
  display: flex;

  & > span {
    overflow: visible;
  }
`

const StyledBadge = styled(Badge)`
  & > sup {
    top: 0.5rem;
    right: 0.5rem;
  }
`
const StyledMenu = styled(CustomMenu)`
  background-color: ${(props) => props.theme.color.grayscale2Lighter};
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  box-shadow: 0 1px 1px ${(props) => props.theme.color.grayscale1};

  & > li:hover {
    background-color: ${(props) => props.theme.color.grayscale2};
  }

  ${(props) => !props.items.length && css`
    display: none;
  `}
`

const StyledOption = styled.span`
  font-size: 1.2rem;
  line-height: 1.6rem;
  padding: 0.8rem 2.1rem 0.8rem 1rem;
  color: ${(props) => props.theme.color.primary4};
  white-space: nowrap;

  &:hover {
    color: ${(props) => props.theme.color.primary2};
  }
`

export {
  Wrapper,
  StyledBadge as Badge,
  StyledOption as Option,
  StyledMenu as Menu,
}
