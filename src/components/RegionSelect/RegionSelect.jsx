
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { createRef, forwardRef, PureComponent } from 'react'
import ReactRegionSelect from 'react-region-select'
import { WindowListener } from '@/components/WindowListener'
import {
  TopDragger,
  BottomDragger,
  LeftDragger,
  RightDragger,
  Region,
} from './RegionSelect.styles'

const BorderSide = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}

class RegionSelect extends PureComponent {
  static propTypes = {
    forwardedRef: PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }),
    constraint: PropTypes.bool,
    maxRegions: PropTypes.number,
    regions: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
      }),
    ).isRequired,
    onMove: PropTypes.func,
    onCreate: PropTypes.func,
    onResize: PropTypes.func,
    onUpdate: PropTypes.func,
    onChange: PropTypes.func,
    regionStyle: PropTypes.shape({
      zIndex: PropTypes.number,
      borderColor: PropTypes.string,
      backgroundColor: PropTypes.string,
    }),
    regionRenderer: PropTypes.func,
    children: PropTypes.element,
  }

  state = {
    borderSide: null,
    regionIndex: null,
    cursorX: null,
    cursorY: null,
    originalRegionX: null,
    originalRegionY: null,
  }

  wrapperRef = createRef();

  getImageWidth = () => {
    const wrapper = this.wrapperRef.current
    return wrapper && wrapper.firstChild.offsetWidth
  }

  getImageHeight = () => {
    const wrapper = this.wrapperRef.current
    return wrapper && wrapper.firstChild.offsetHeight
  }

  getImageOffset = () => {
    const wrapper = this.wrapperRef.current
    const rect = wrapper.getBoundingClientRect()
    return {
      x: rect.left + window.pageXOffset - document.documentElement.clientLeft,
      y: rect.top + window.pageYOffset - document.documentElement.clientTop,
    }
  }

  getImageCursorPosition = (cursorX, cursorY) => {
    const offset = this.getImageOffset()
    const imageHeight = this.getImageHeight()
    const imageWidth = this.getImageWidth()
    return {
      x: (cursorX - offset.x) / imageWidth * 100,
      y: (cursorY - offset.y) / imageHeight * 100,
    }
  }

  onMouseDown = (e) => {
    let { regionIndex } = e.target.dataset
    regionIndex = regionIndex || (e.target.parentElement && e.target.parentElement.dataset && e.target.parentElement.dataset.regionIndex)
    if (!regionIndex) {
      return
    }

    regionIndex = parseInt(regionIndex)
    const region = this.props.regions[regionIndex]
    const { borderSide } = e.target.dataset
    const cursor = this.getImageCursorPosition(e.clientX, e.clientY)

    e.preventDefault()
    e.stopPropagation()

    this.setState({
      regionIndex,
      borderSide,
      cursorX: cursor.x,
      cursorY: cursor.y,
      originalRegionX: region.x,
      originalRegionY: region.y,
    })
  }

  onMouseUp = () => {
    if (
      this.state.regionIndex != null &&
      this.props.regions[this.state.regionIndex] &&
      this.props.regions[this.state.regionIndex].isChanging
    ) {
      const regions = this.props.regions.map((region) => ({
        ...region,
        isChanging: false,
      }))

      this.onChange(regions)
    }

    this.setState({
      regionIndex: null,
      borderSide: null,
      cursorX: null,
      cursorY: null,
      originalRegionX: null,
      originalRegionY: null,
    })
  }

  onMouseMove = (e) => {
    const { regionIndex } = this.state

    if (this.state.regionIndex === null) {
      return
    }

    const cursor = this.getImageCursorPosition(e.clientX, e.clientY)
    const regions = this.props.regions.map((region, index) => {
      if (index !== regionIndex) {
        return region
      }

      if (this.state.borderSide) {
        return {
          ...this.resizeRegion(region, cursor),
          isChanging: true,
        }
      }

      return {
        ...this.moveRegion(region, cursor),
        isChanging: true,
      }
    })

    this.onChange(regions)
  }

  resizeUp = (region, cursor) => {
    const y2 = region.y + region.height
    let y = cursor.y < 0 ? 0 : cursor.y
    y = y > y2 ? y2 : y
    return {
      ...region,
      y,
      height: y2 - y,
    }
  }

  resizeDown = (region, cursor) => {
    const y = cursor.y < 100 ? cursor.y : 100
    return {
      ...region,
      height: cursor.y < region.y ? 0 : y - region.y,
    }
  }

  resizeLeft = (region, cursor) => {
    const x2 = region.x + region.width
    let x = cursor.x < 0 ? 0 : cursor.x
    x = x > x2 ? x2 : x
    return {
      ...region,
      x,
      width: x2 - x,
    }
  }

  resizeRight = (region, cursor) => {
    const x = cursor.x < 100 ? cursor.x : 100
    return {
      ...region,
      width: cursor.x < region.x ? 0 : x - region.x,
    }
  }

  moveRegion = (region, cursor) => {
    let x = cursor.x - this.state.cursorX + this.state.originalRegionX
    let y = cursor.y - this.state.cursorY + this.state.originalRegionY
    x = x + region.width > 100 ? 100 - region.width : x
    x = x < 0 ? 0 : x
    y = y > 100 + region.height ? 100 - region.height : y
    y = y < 0 ? 0 : y

    return {
      ...region,
      x,
      y,
    }
  }

  resizeRegion = (region, cursor) => {
    switch (this.state.borderSide) {
      case BorderSide.UP:
        return this.resizeUp(region, cursor)
      case BorderSide.DOWN:
        return this.resizeDown(region, cursor)
      case BorderSide.LEFT:
        return this.resizeLeft(region, cursor)
      case BorderSide.RIGHT:
        return this.resizeRight(region, cursor)
    }
  }

  isMoving = (originalRegion, changedRegion) => (
    originalRegion && changedRegion && (
      originalRegion.x !== changedRegion.x ||
      originalRegion.y !== changedRegion.y
    )
  )

  isResizing = (originalRegion, changedRegion) => (
    originalRegion && changedRegion && (
      originalRegion.width !== changedRegion.width ||
      originalRegion.height !== changedRegion.height
    )
  )

  onCreateMoveResizeUpdate = (changedRegion) => {
    const {
      onCreate,
      onMove,
      onResize,
      onUpdate,
    } = this.props

    if (changedRegion.new) {
      return onCreate && onCreate(changedRegion)
    }

    const originalRegion = this.props.regions.find((r) => r.data.index === changedRegion.data.index)
    if (this.isResizing(originalRegion, changedRegion)) {
      return onResize && onResize(changedRegion, this.state.borderSide)
    }

    if (this.isMoving(originalRegion, changedRegion)) {
      return onMove && onMove(changedRegion)
    }

    onUpdate && onUpdate(changedRegion)
  }

  onChange = (regions) => {
    const changedRegion = regions.find((r, index) => !isEqual(r, this.props.regions[index]))
    if (!changedRegion) {
      return
    }

    if (this.props.onUpdate) {
      return this.onCreateMoveResizeUpdate(changedRegion)
    }

    this.props.onChange && this.props.onChange(regions)
  }

  regionRenderer = (regProps) => (
    <Region data-region-index={regProps.index}>
      <TopDragger data-border-side={BorderSide.UP} />
      <BottomDragger data-border-side={BorderSide.DOWN} />
      <LeftDragger data-border-side={BorderSide.LEFT} />
      <RightDragger data-border-side={BorderSide.RIGHT} />
      {this.props.regionRenderer && this.props.regionRenderer(regProps)}
    </Region>
  )

  render = () => (
    <div
      ref={this.wrapperRef}
    >
      <WindowListener
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      />
      <ReactRegionSelect
        ref={this.props.forwardedRef}
        constraint={this.props.constraint}
        maxRegions={this.props.maxRegions}
        onChange={this.onChange}
        regionRenderer={this.regionRenderer}
        regionStyle={this.props.regionStyle}
        regions={this.props.regions}
      >
        {this.props.children}
      </ReactRegionSelect>
    </div>
  )
}

const WrappedRegionSelect = forwardRef((props, ref) => (
  <RegionSelect
    {...props}
    forwardedRef={ref}
  />
))

export {
  WrappedRegionSelect as RegionSelect,
  BorderSide,
}
