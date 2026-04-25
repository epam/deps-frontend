
import styled from 'styled-components'
import { PageSwitcher } from '@/components/PageSwitcher'

const CenteredPageSwitcher = styled(PageSwitcher)`
  .ant-select-selection-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ant-btn-circle {
    border: none;
    min-width: 2.5rem;
    min-height: 2rem;
    width: auto;
    height: auto;
    font-size: 2rem;

    &::after {
      animation: 0s;
    }
  }
`

const OptionContent = styled.div`
  display: flex;
  gap: 0.8rem;
    
  & > span {
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`

export {
  CenteredPageSwitcher,
  OptionContent,
}
