
import styled from 'styled-components'
import { TableColumnsIcon } from '@/components/Icons/TableColumnsIcon'
import { RadioGroup } from '@/components/Radio'

const ColumnsIcon = styled(TableColumnsIcon)`
  display: flex;
  align-items: center;
  height: 100%;
`

const RowsIcon = styled(TableColumnsIcon)`
  display: flex;
  align-items: center;
  height: 100%;
  transform: rotate(270deg) scale(0.9, 1.15);
`

const ViewSwitcher = styled(RadioGroup)`
  display: flex;
  margin-top: 2.5rem;
  
  && .ant-radio-button-wrapper {
    display: flex;
    justify-content: center;
    width: 4rem;
    background-color: ${(props) => props.theme.color.grayscale14};
    color: ${(props) => props.theme.color.primary2};
    border: 1px solid ${(props) => props.theme.color.grayscale21};
    font-weight: 600;
    border-radius: 0 4px 4px 0;

    &-checked {
      background-color: ${(props) => props.theme.color.primary2};
      color: ${(props) => props.theme.color.primary3};
      
      &:hover {
        background-color: ${(props) => props.theme.color.primary2};
        border-color: ${(props) => props.theme.color.grayscale21};
      }
      
      &:before {
        background-color: ${(props) => props.theme.color.primary2};
      }
    }
    
    &:focus-within {
      box-shadow: none;
    }
  }

  & > span:first-child  {
    .ant-radio-button-wrapper {
      border-radius: 4px 0 0 4px;
    }
  }
`

export {
  ColumnsIcon,
  RowsIcon,
  ViewSwitcher,
}
