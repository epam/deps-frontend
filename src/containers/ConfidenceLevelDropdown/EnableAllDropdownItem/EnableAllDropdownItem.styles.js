
import styled, { css } from 'styled-components'
import { Switch } from '@/components/Switch'

const StyledSwitch = styled(Switch)`
  ${(props) => props.$indeterminate && css`
    background-color: ${(props) => props.theme.color.primary2};

    .ant-switch-handle {
      width: 1.3rem;
      height: 0.3rem;
      background-color: ${(props) => props.theme.color.primary3};
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 1rem;

      &:before {
        display: none;
      }
    }
  `}
`

const EnableAllText = styled.div`
  color: ${(props) => props.theme.color.grayscale18};
  font-weight: 600;
`

export {
  EnableAllText,
  StyledSwitch as Switch,
}
