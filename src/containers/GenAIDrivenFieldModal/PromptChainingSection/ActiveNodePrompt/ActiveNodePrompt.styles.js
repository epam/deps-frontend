
import styled, { css } from 'styled-components'
import { Input } from '@/components/Input'
import { Tooltip } from '@/components/Tooltip'

const PromptInput = styled(Input.TextArea)`
  width: 100%;
  resize: none;
  border: none;

  &.ant-input {
    height: 100%;
  }

  ${(props) => props.$hasRequiredMark && css`
    &.ant-input:placeholder-shown {
      padding-left: 2.1rem;
    }
  `}
`

const PromptInputTooltip = styled(Tooltip)`
  position: relative;
  height: 100%;
  width: 100%;
`

const RequiredMark = styled.span`
  position: absolute;
  left: 1rem;
  top: 0.8rem;
  display: inline-block;
  color: ${(props) => props.theme.color.errorDark};
  line-height: 1;
  pointer-events: none;
`

export {
  PromptInput,
  PromptInputTooltip,
  RequiredMark,
}
