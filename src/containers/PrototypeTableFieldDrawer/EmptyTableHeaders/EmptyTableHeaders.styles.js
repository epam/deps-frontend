
import styled from 'styled-components'
import emptyPageImage from '@/assets/images/emptyPage.png'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.4rem;
  padding: 2.4rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-radius: 0.8rem;
`

const Image = styled.div`
  width: 30%;
  aspect-ratio: 1;
  background-image: url(${emptyPageImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.p`
  color: ${(props) => props.theme.color.grayscale12};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.6rem;
  text-align: center;
`

export {
  ContentWrapper,
  Image,
  Title,
  Wrapper,
}
