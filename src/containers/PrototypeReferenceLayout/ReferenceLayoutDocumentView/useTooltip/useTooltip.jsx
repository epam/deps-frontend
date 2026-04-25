
import debounce from 'lodash/debounce'
import { useCallback, useMemo, useState } from 'react'
import { Tooltip } from './useTooltip.styles'

const TOOLTIP_INITIAL_CONFIG = {
  visible: false,
  x: 0,
  y: 0,
}
const TOOLTIP_CONTAINER_CLASSNAME = 'tooltip-container'
const DEBOUNCE_TIME = 400

const useTooltip = ({
  title,
}) => {
  const [tooltipConfig, setTooltipConfig] = useState(TOOLTIP_INITIAL_CONFIG)

  const hideTooltip = useCallback(() => {
    setTooltipConfig(TOOLTIP_INITIAL_CONFIG)
  }, [])

  const showTooltip = useMemo(() => debounce(
    (e) => {
      const stage = e.target.getStage()
      const mousePos = stage.getPointerPosition()

      setTooltipConfig({
        visible: true,
        x: mousePos.x,
        y: mousePos.y,
      })
    }, [DEBOUNCE_TIME]),
  [],
  )

  const renderTooltip = useCallback((isDragging) => {
    if (isDragging || !tooltipConfig.visible) {
      return null
    }

    return (
      <Tooltip
        $left={tooltipConfig.x}
        $top={tooltipConfig.y}
        getPopupContainer={() => document.querySelector(`.${TOOLTIP_CONTAINER_CLASSNAME}`)}
        open={!isDragging && tooltipConfig.visible}
        title={title}
        triggerClassName={TOOLTIP_CONTAINER_CLASSNAME}
      />
    )
  }, [
    tooltipConfig,
    title,
  ])

  return {
    showTooltip,
    hideTooltip,
    renderTooltip,
  }
}

export {
  useTooltip,
}
