
import styled from 'styled-components'
import emptyPageImage from '@/assets/images/emptyPage.png'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 10rem;
`

export const Image = styled.div`
  width: 30%;
  aspect-ratio: 1;
  background-image: url(${emptyPageImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  margin-bottom: 8rem;
`

export const Text = styled.p`
  font-weight: 600;
  font-size: 1.6rem;
  text-transform: capitalize;
`

export const Link = styled.a`
  font-weight: 600;
  font-size: 1.6rem;
  text-transform: capitalize;
  color: ${(props) => props.theme.color.primary2};
  text-decoration: none;
  margin-left: 0.5rem;
`
