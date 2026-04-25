
import PropTypes from 'prop-types'
import { pointShape } from '@/models/Point'

class ImageLayout {
  constructor ({
    id,
    order,
    title,
    description,
    filePath,
    polygon,
  }) {
    this.id = id
    this.order = order
    this.title = title
    this.description = description
    this.filePath = filePath
    this.polygon = polygon
  }
}

const imageLayoutShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  polygon: PropTypes.arrayOf(
    pointShape.isRequired,
  ),
})

export {
  ImageLayout,
  imageLayoutShape,
}
