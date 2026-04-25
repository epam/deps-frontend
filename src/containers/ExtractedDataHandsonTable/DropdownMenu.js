
import { Localization, localize } from '@/localization/i18n'
import { createElement } from '@/utils/document'
import './Dropdown.css'

const HT_MASTER_CLASS = 'ht_master'
const WT_HOLDER_CLASS = 'wtHolder'
const MenuClassName = 'dropdown_menu'
const WrapperClassName = 'dropdown_wrapper'
const ActiveClassName = 'active'
const COEFFICIENT_FOR_INDENT = 4
const ArrowMnemonic = '\u203A'

const clearActiveClass = (table) => {
  const dropdownWrappers = table.getElementsByClassName(WrapperClassName)

  Array.from(dropdownWrappers).forEach((w) => {
    w.classList.remove(ActiveClassName)
  })
}

const getWtHolderItem = (table) => {
  const [htMaster] = table.getElementsByClassName(HT_MASTER_CLASS)
  const [wtHolder] = htMaster.getElementsByClassName(WT_HOLDER_CLASS)
  return wtHolder
}

const removeMenuItem = (e, table, menuId) => {
  clearActiveClass(table)
  const menuItem = document.getElementById(menuId)
  menuItem.remove()
  e.target.onscroll = null
}

const renderMenu = (highlighters, menuId, table) => {
  const menu = createElement('ul', MenuClassName)
  menu.id = menuId
  menu.style.visibility = 'hidden'

  highlighters.forEach(({ highlighter, page }) => {
    const menuItem = createElement('li')

    menuItem.addEventListener('click', () => {
      highlighter()
      menu.remove()
      clearActiveClass(table)
    })

    menuItem.innerText = localize(Localization.OPTION_TITLE, { page })
    menu.appendChild(menuItem)
  })

  return menu
}

const renderDropdownMenu = (highlighters, table) => {
  const tableId = table.id
  const menuId = `${tableId}_menu`
  const wrapper = createElement('div', WrapperClassName)
  wrapper.textContent = ArrowMnemonic
  wrapper.tabIndex = -1

  wrapper.addEventListener('click', (e) => {
    e.stopPropagation()

    const item = e.target
    const wtHolder = getWtHolderItem(table)
    const isActive = item.classList.contains(ActiveClassName)
    const menuItem = document.getElementById(menuId)

    clearActiveClass(table)

    if (isActive) {
      menuItem && menuItem.remove()
      wtHolder.onscroll = null
      return
    }

    if (menuItem) {
      menuItem.remove()
    }

    item.classList.add(ActiveClassName)

    wtHolder.onscroll = (e) => removeMenuItem(e, table, menuId)

    const menu = renderMenu(highlighters, menuId, table)
    document.body.append(menu)
    const { offsetHeight: menuHeight, offsetWidth: menuWidth } = menu
    menu.remove()

    const { x: tableX, y: tableY } = table.getBoundingClientRect()
    const { x, y, height, width } = item.getBoundingClientRect()
    const { offsetHeight, offsetWidth } = document.documentElement

    const top = offsetHeight > (y + height * COEFFICIENT_FOR_INDENT + menuHeight)
      ? `${Math.floor(y - tableY + height)}px`
      : `${Math.floor(y - tableY - menuHeight)}px`

    const left = offsetWidth > (x + width * COEFFICIENT_FOR_INDENT + menuWidth)
      ? `${Math.floor(x - tableX)}px`
      : `${Math.floor(x - tableX - menuWidth + width)}px`

    menu.style.cssText += `top: ${top}; left: ${left}; visibility: visible;`

    table.appendChild(menu)

    wrapper.focus()
  })

  wrapper.addEventListener('blur', () => {
    const menu = document.getElementById(menuId)

    if (menu) {
      menu.remove()
    }
  })

  return wrapper
}

export {
  renderDropdownMenu,
}
