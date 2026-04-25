
import { HotTable } from '@handsontable/react'
import styled from 'styled-components'
import { Spin } from '@/components/Spin'
import { theme } from '@/theme/theme.default'

export const StyledHotTable = styled(HotTable)`
  position: relative;

  .ht_master {
    overflow: visible !important;

    td[class*=fullySelectedMergedCell]::before {
      opacity: 0.1 !important;
    }
  }

  .handsontableInputHolder,
  && .wtBorder.current,
  && .wtBorder.area {
    z-index: unset;
  }

  .wtHolder {
    &::-webkit-scrollbar-track {
      background: ${theme.color.grayscale14};
    }

    &::-webkit-scrollbar-thumb {
      background: ${theme.color.grayscale15};
    }
  }

  .ht_clone_top,
  .ht_clone_left,
  .ht_clone_top_left_corner {
    z-index: 1;
  }
  
  .handsontableInput {
    box-sizing: content-box;
  }
`

export const InfiniteLoadWrapper = styled.div`
  position: relative;
`

export const HorizontalSpin = styled(Spin)`
  width: 100%;
  align-items: center;
  position: absolute;
  top: 50%;
  z-index: 10;
`

export const VerticalSpin = styled(Spin)`
  height: 100%;
  position: absolute;
  top: 50%;
  right: 2rem;
`
