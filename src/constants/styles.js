
import { css } from 'styled-components'

const ANIMATION = {
  animationAppearTop: css`
    opacity: 0;
    animation: appearTop 700ms ease 0ms normal forwards;

    @keyframes appearTop {
      0% {
        opacity: 0;
        transform: translateY(-100%);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  animationAppearScaleFromZero: css`
    opacity: 0;
    transform: scale(0);
    animation: appearFromZero 300ms ease 0ms normal forwards;

    @keyframes appearFromZero {
      0% {
        opacity: 0;
        transform: scale(0);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
}

const CENTERED = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
`

export {
  ANIMATION,
  CENTERED,
}
