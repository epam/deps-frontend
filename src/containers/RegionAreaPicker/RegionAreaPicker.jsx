
import PropTypes from 'prop-types'
import { Component } from 'react'
import { ImageViewer } from '@/components/ImageViewer'
import { Modal } from '@/components/Modal'
import { RegionSelect } from '@/components/RegionSelect'
import { localize, Localization } from '@/localization/i18n'
import { Rect } from '@/models/Rect'
import { theme } from '@/theme/theme.default'
import { loadImageURL } from '@/utils/image'
import { transposeRect } from '@/utils/math'

const MODAL_WIDTH = 0.9

const regionStyle = {
  zIndex: 5,
  borderColor: theme.color.errorDark,
  background: theme.color.primary2Light,
}

const getFormattedCoordinates = (region, imageProps) => {
  const { rotation } = imageProps
  const { x, y, width, height } = region

  const rect = new Rect(
    x / 100,
    y / 100,
    width / 100,
    height / 100,
  )

  return transposeRect(rotation, rect)
}

class RegionAreaPicker extends Component {
  static propTypes = {
    renderPageSwitcher: PropTypes.func,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    imageUrl: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
  }

  rotation = 0

  state = {
    regions: [],
  }

  onRotate = (rotation) => {
    this.rotation = rotation
  }

  onOk = async () => {
    const image = await loadImageURL(this.props.imageUrl)

    const imageProps = {
      rotation: this.rotation,
      imageWidth: image.width,
      imageHeight: image.height,
    }

    this.props.onOk(
      getFormattedCoordinates(this.state.regions[0], imageProps),
    )
  }

  onChange = (regions) => {
    this.setState({
      regions,
    })
  }

  renderRegionSelect = (canvas) => (
    <RegionSelect
      constraint
      maxRegions={1}
      onChange={this.onChange}
      regionStyle={regionStyle}
      regions={this.state.regions}
    >
      {canvas}
    </RegionSelect>
  )

  renderImageViewer = () => (
    <ImageViewer
      fetching={this.props.fetching}
      imageUrl={this.props.imageUrl}
      isFixedSize
      onRotate={this.onRotate}
      renderOverlay={this.renderRegionSelect}
      renderPageSwitcher={this.props.renderPageSwitcher}
    />
  )

  render = () => (
    <Modal
      maskClosable={false}
      okText={localize(Localization.SELECT)}
      onCancel={this.props.onCancel}
      onOk={this.onOk}
      open
      title={this.props.title}
      width={MODAL_WIDTH * 100 + 'vw'}
    >
      <h3>{this.props.message}</h3>
      {this.renderImageViewer()}
    </Modal>
  )
}

export {
  RegionAreaPicker,
  regionStyle,
  getFormattedCoordinates,
}
