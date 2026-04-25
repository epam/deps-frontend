
import styled from 'styled-components'
import emptyPageImage from '@/assets/images/emptyPage.png'

const Wrapper = styled.div`
  margin: 6rem auto 0;
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 24rem;
  gap: 4rem;
`

const Image = styled.div`
  width: 24rem;
  aspect-ratio: 1;
  background-image: url(${emptyPageImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`

const Title = styled.h3`
  font-size: 2.2rem;
  color: ${(props) => props.theme.color.grayscale12};
  margin-bottom: 1.6rem;
`

const TextContent = styled.h4`
  font-size: 1.4rem;
`

export {
  Wrapper,
  Image,
  ContentWrapper,
  Title,
  TextContent,
}
