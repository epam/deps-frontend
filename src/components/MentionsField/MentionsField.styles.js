
import styled from 'styled-components'

const Wrapper = styled.div`
  .mentions {
    &__highlighter {
      border: 1px solid transparent;
      padding: 0.8rem 1.2rem;
    }

    &__input {
      border: 1px solid ${(props) => props.theme.color.grayscale1};
      border-radius: 4px;
      padding: 0.8rem 1.2rem;
      outline: none;

      &::placeholder {
        color: ${(props) => props.theme.color.grayscale22};
      }
      
      &:hover {
        border-color: ${(props) => props.theme.color.primary6};
      }
      
      &:focus {
        border-color: ${(props) => props.theme.color.primary2};
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }

    &__suggestions {
      max-height: 20rem;
      overflow-y: auto;
      border: 1px solid ${(props) => props.theme.color.grayscale1};
      background-color: ${(props) => props.theme.color.primary3};
      border-radius: 4px;
      box-shadow: 0 3px 19px 0 ${(props) => props.theme.color.shadow3};

      &__item {
        padding: 0.8rem 1.2rem;
        border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
        line-height: 2.2rem;

        &:hover {
          background-color: ${(props) => props.theme.color.grayscale20};
          color: ${(props) => props.theme.color.primary2};
        }
      }
    }
  }
  
  .mention {
    position: relative;
    z-index: 1;
    color: ${(props) => props.theme.color.primary2};
    font-weight: 600;
  }
`

export {
  Wrapper,
}
