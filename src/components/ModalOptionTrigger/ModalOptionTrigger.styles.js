
import styled, { css } from 'styled-components'

const Title = styled.h3`
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem; 
  font-weight: 600;

  ${(props) => props.$isDisabled && css`
    color: ${(props) => props.theme.color.grayscale17};
  `}
`

const Description = styled.p`
  font-size: 1.2rem;
  margin: 0;
`

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.6rem;
  height: 100%;
  color: ${(props) => props.theme.color.grayscale11};

  ${(props) => props.$isDisabled && css`
    cursor: not-allowed;
    color: ${(props) => props.theme.color.grayscale17};

    &:hover {
      background-color: ${(props) => props.theme.color.primary3};
    }
  `}
`

export {
  ItemWrapper,
  Title,
  Description,
}
