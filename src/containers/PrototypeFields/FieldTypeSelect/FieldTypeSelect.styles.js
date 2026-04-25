
import styled from 'styled-components'
import { Select } from '@/components/Select'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`

const StyledSelect = styled(Select)`
  min-width: 7rem;

  & .ant-select-selector {
    border-radius: 16px !important;
  }

  & .ant-select-selection-item {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;

    & > span {
      display: none;
    }
  }

  & .ant-select-dropdown {
    min-width: 16.5rem !important;

    & .ant-select-item-option-content {
      display: flex;
      align-items: center;

      & > svg {
        margin-right: 0.8rem;
      }
    }
  }

  & .ant-select-arrow {
    color: ${(props) => props.theme.color.primary2} !important;
  }
`

export {
  Wrapper,
  StyledSelect as Select,
}
