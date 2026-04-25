
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Tooltip } from '@/components/Tooltip'

const Wrapper = styled.div`
  display: flex;
  width: 100%;

  & > span:last-of-type {
    margin-left: auto;
  }

  & .ant-tooltip-arrow {
    display: none;
  }

  & .ant-tooltip {
    max-width: none;

    & .ant-tooltip-inner {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      justify-content: space-between;
      max-width: 33rem;
      background-color: ${(props) => props.theme.color.primary3};
  
      & > span,
      & > div {
        margin-right: 0;
      }
    }
  }
`

const KeysWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 48rem;
`

const IconButton = styled(Button.Icon)`
  margin-left: auto;
  border: 1px solid ${(props) => props.theme.color.primary2};
  border-radius: 50%;

  &:disabled {
    border-color: ${(props) => props.theme.color.grayscale1Darker};
  }
`

const TagButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 0.4rem 1rem;
  color: ${(props) => props.theme.color.grayscale12};

  & > svg {
    margin-right: 0.5rem;
  }
`

const Counter = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(props) => props.theme.color.primary2};
`

const StyledTooltip = styled(Tooltip)`
  background-color: ${(props) => props.theme.color.primary3};
  margin-left: 0 !important;
`

export {
  Wrapper,
  IconButton,
  KeysWrapper,
  TagButton,
  Counter,
  StyledTooltip as Tooltip,
}
