
import { Collapse } from 'antd/lib/index'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ExpandIconPosition } from '../ExpandIconPosition'

const normalizeKeys = (keys) => {
  if (keys == null) return []
  return Array.isArray(keys) ? keys : [keys]
}

const CustomCollapse = ({
  className,
  defaultActiveKey,
  expandIconPosition = ExpandIconPosition.END,
  renderExpandButton,
  renderPanels,
}) => {
  const [activeKey, setActiveKey] = useState(() => normalizeKeys(defaultActiveKey))
  const prevDefaultActiveKeyRef = useRef(normalizeKeys(defaultActiveKey))

  useEffect(() => {
    const normalizedKeys = normalizeKeys(defaultActiveKey)

    if (!isEqual(prevDefaultActiveKeyRef.current, normalizedKeys)) {
      setActiveKey((prev) => {
        const merged = new Set([...prev, ...normalizedKeys])
        return [...merged]
      })
      prevDefaultActiveKeyRef.current = normalizedKeys
    }
  }, [defaultActiveKey])

  const getExpandIcon = useCallback((panelProps) => {
    const onClick = (e) => {
      e.stopPropagation()
      e.preventDefault()
      if (panelProps.isActive) {
        const newKeys = activeKey.filter((key) => key !== panelProps.panelKey)
        setActiveKey(newKeys)
      } else {
        setActiveKey([...activeKey, panelProps.panelKey])
      }
    }

    return renderExpandButton(panelProps, onClick)
  }, [activeKey, renderExpandButton])

  return (
    <Collapse
      activeKey={activeKey}
      className={className}
      destroyInactivePanel
      expandIcon={getExpandIcon}
      expandIconPosition={expandIconPosition}
      ghost
      onChange={(keys) => setActiveKey(normalizeKeys(keys))}
    >
      {renderPanels()}
    </Collapse>
  )
}

CustomCollapse.Panel = Collapse.Panel

CustomCollapse.propTypes = {
  className: PropTypes.string,
  defaultActiveKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  expandIconPosition: PropTypes.oneOf(Object.values(ExpandIconPosition)),
  renderExpandButton: PropTypes.func.isRequired,
  renderPanels: PropTypes.func.isRequired,
}

export {
  CustomCollapse,
}
