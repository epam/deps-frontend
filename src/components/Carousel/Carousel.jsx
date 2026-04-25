
import AntdCarousel from 'antd/es/carousel'
import { forwardRef } from 'react'
import 'antd/lib/carousel/style/index.less'

const Carousel = forwardRef(
  (props, ref) => (
    <AntdCarousel
      ref={ref}
      {...props}
    />
  ),
)

export {
  Carousel,
}
