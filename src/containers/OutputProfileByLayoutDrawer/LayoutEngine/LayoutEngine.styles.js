
import styled from 'styled-components'
import { CustomSelect } from '@/components/Select'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.6rem 0;
`

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale13};
  margin-bottom: 8px;
`

const StyledCustomSelect = styled(CustomSelect)`
  && .ant-select-selector {
    height: 4rem;
    padding: 0.8rem 1.6rem;
  }

  .ant-select-selection-item {
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 2.2rem !important;
    color: ${(props) => props.theme.color.grayscale18};
  }
`

export {
  Label,
  Wrapper,
  StyledCustomSelect as CustomSelect,
}
