
import styled from 'styled-components'
import { CustomSelect } from '@/components/Select'

const LabelProvider = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale12};
`

const StyledCustomSelect = styled(CustomSelect)`
  &.ant-select-single.ant-select-open .ant-select-selection-item {
    ${LabelProvider} {
      color: ${(props) => props.theme.color.grayscale17};
    }
  }
`

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const OptionModel = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2.2rem;
`

const OptionProvider = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale12};
`

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LabelModel = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
`

export {
  LabelModel,
  LabelProvider,
  LabelWrapper,
  OptionModel,
  OptionProvider,
  OptionWrapper,
  StyledCustomSelect as CustomSelect,
}
