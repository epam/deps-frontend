
import styled from 'styled-components'

const CommentsContent = styled.div`
  width: 100%;
  padding: 0.5rem;
`

const CommentsBtnGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
`

const CommentsInput = styled.div`
  width: 100%;

  textarea {
    width: 100%;
    resize: none;
  }
`

const CommentsHeader = styled.div`
  padding: 2rem 0;
  padding-top: 0;
  font-size: 1.4rem;
  font-weight: 500;
`

const CommentItem = styled.div`
  margin-bottom: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${(props) => props.theme.color.secondaryLight};

  &:first-child {
    border-top: none;
  }

  & div {
    margin-top: 0.4rem;
  }
`

const CommentUser = styled.div`
  font-weight: 600;
`

export {
  CommentsContent,
  CommentsBtnGroup,
  CommentsInput,
  CommentsHeader,
  CommentItem,
  CommentUser,
}
