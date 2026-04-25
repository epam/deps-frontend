
import styled from 'styled-components'
import { Spin } from '@/components/Spin'

export const MainContentWrapper = styled.div`
  flex: 1;
  max-height: calc(100% - 14rem);
  border-inline: 1px solid ${({ theme }) => theme.color.grayscale1};
  overflow: auto;
`

export const StyledSpin = styled(Spin)`
  height: 100%;

  & .ant-spin-container {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    height: 100%;
    padding: 1.6rem;
  }
`

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem;
  border: 1px solid ${({ theme }) => theme.color.grayscale1};
  border-radius: 0.4rem 0.4rem 0 0;
`

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`

export const Divider = styled.div`
  width: 1px;
  height: 2.4rem;
  background-color: ${({ theme }) => theme.color.grayscale1};
`
