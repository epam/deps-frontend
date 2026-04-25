
import styled from 'styled-components'
import { CustomSelect } from '@/components/Select'

export const Select = styled(CustomSelect)`
  width: 13.8rem;
    
  .ant-select-selector {
    background-color: ${(props) => props.theme.color.grayscale14} !important;
  }
    
  .ant-select-selection-item {
    font-weight: 600;
    color: ${(props) => props.theme.color.grayscale18};
  }
`
