
import styled from 'styled-components'
import { Collapse } from '@/components/Collapse/'
import { DownOutlined } from '@/components/Icons/DownOutlined'
import { theme } from '@/theme/theme.default'

const StyledCollapse = styled(Collapse)`
  && {
    margin-bottom: 0.8rem;
    background: ${theme.color.primary3};
  }

  > div {
    border: none !important;

    > div  {
      padding: 1.7rem 4rem 1.7rem 1.6rem !important;
    }
    
    > div  ul {
      list-style: disc;
      list-style-position: inside;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }

    ul:last-child {
      margin-bottom: 0;
    }
    
  }

  :nth-child(even) > div > div:first-child {
    background-color: ${theme.color.grayscale6};
  }

  :nth-child(odd) > div > div:first-child {
    background-color: ${theme.color.grayscale6Lighter};
  }  
`

const Question = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.2rem;
  margin-bottom: 0;
`

const StyledIcon = styled(DownOutlined)`
  & svg {
    height: 2rem;
    width: 2rem;
    fill: ${theme.color.grayscale5};
  }
`

const Wrapper = styled.div`
  padding: 1.6rem;
  background: ${theme.color.primary3};
`

const SearchInputWrapper = styled.div`
  padding-bottom: 1.6rem;
  background: ${theme.color.primary3};
`

const HelpAnswer = styled.div`  
  display: flex;
  justify-content: space-between;  

  div {
    width: 45%;
    margin-bottom: 1rem;
  }  
`

const WrapperImg = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
`

export {
  Wrapper,
  StyledCollapse as Collapse,
  StyledIcon as Icon,
  Question,
  SearchInputWrapper,
  HelpAnswer,
  WrapperImg,
}
