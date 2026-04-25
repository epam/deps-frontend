
import styled from 'styled-components'
import emptyPageImage from '@/assets/images/emptyPage.png'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding-block: 2rem;
`

const Image = styled.div`
  width: 16%;
  aspect-ratio: 1;
  background-image: url(${emptyPageImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale16};
  margin-bottom: 2.4rem;
`

export {
  Image,
  Title,
  Wrapper,
}
