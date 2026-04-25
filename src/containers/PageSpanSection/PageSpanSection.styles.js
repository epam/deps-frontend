
import styled from 'styled-components'
import { DualToggle } from '@/components/DualToggle'
import { InputNumber } from '@/components/InputNumber'

const Wrapper = styled.div`
  display: flex;
`

const PageRange = styled.div`
  display: flex;
  align-items: center;
`

const PageModeToggle = styled(DualToggle)`
  margin-right: 1.6rem;
  
  && .ant-radio-button-wrapper {
    width: 14rem;
  }
`

const PageInput = styled(InputNumber)`
  width: 9.5rem;
`

const Separator = styled.div`
  height: 1px;
  width: 14px;
  margin: 0 1.2rem;
  background-color: ${(props) => props.theme.color.grayscale18};
`

const PageLabel = styled.span`
  margin-left: 1.6rem;
  color: ${(props) => props.theme.color.grayscale18};
`

export {
  Wrapper,
  PageRange,
  PageModeToggle,
  PageInput,
  Separator,
  PageLabel,
}
