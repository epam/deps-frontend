
import { useCallback, useState } from 'react'

const Expander = (props) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapse = useCallback(() => {
    setCollapsed((prevCollapsed) => !prevCollapsed)
  }, [])

  if (typeof props.children === 'function') {
    return props.children(
      collapsed,
      toggleCollapse,
    )
  }

  return props.children
}

export {
  Expander,
}
