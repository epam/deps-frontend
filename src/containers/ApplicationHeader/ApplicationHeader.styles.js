
import styled from 'styled-components'

const Header = styled.header`
  padding: 0.8rem 1.6rem 0.8rem 1.2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  background: ${(props) => props.theme.color.primary3};
  box-shadow: 0 0.3rem 1.9rem ${(props) => props.theme.color.grayscale1};

  & span.ant-badge {
    top: 0.6rem;
  }

  & .ant-badge-count {
    right: -20%;
    top: -25%;
  }

  & .ant-spin-blur {
    visibility: hidden;
    opacity: 0;
  }

  & .ant-spin-nested-loading {
    margin-left: auto;
  }
`

const StyledLogoSearch = styled.div`
  display: flex;
  align-items: center;
  width: 29%;
`

const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export {
  Header,
  StyledLogoSearch,
  StyledWrapper,
}
