
import styled from 'styled-components'
import { Pagination } from '@/components/Pagination'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: min(100vw, 190rem);
  min-width: 80rem;
  padding: 1.6rem 2.4rem;
  background: ${(props) => props.theme.color.grayscale14};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.color.grayscale21};
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 3.2rem;
`

export const Title = styled.div`
  flex: 1;
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 3.2rem;
  color: ${(props) => props.theme.color.grayscale16};
`

export const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ant-pagination-simple-pager {
    display: flex !important;
    align-items: center;
    font-family: 'Open Sans', sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.6rem;
    text-align: center;
    color: ${(props) => props.theme.color.grayscale16};
  }
`
