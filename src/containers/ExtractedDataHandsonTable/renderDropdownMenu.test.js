
import { mockEnv } from '@/mocks/mockEnv'
import { createElement } from '@/utils/document'
import { renderDropdownMenu } from './DropdownMenu'

jest.mock('@/utils/env', () => mockEnv)

const HT_MASTER_CLASS = 'ht_master'
const WT_HOLDER_CLASS = 'wtHolder'
const TABLE_ID = 'testId'

const highlighters = [
  {
    highlighter: jest.fn(),
    page: 1,
  },
  {
    highlighter: jest.fn(),
    page: 2,
  },
]

describe('Component: DropdownMenu.js', () => {
  const Table = createElement('div')
  Table.id = TABLE_ID

  const renderTable = (Table) => {
    const htMaster = createElement('div')
    htMaster.classList.add(HT_MASTER_CLASS)

    const wtHolder = createElement('div')
    wtHolder.classList.add(WT_HOLDER_CLASS)

    htMaster.append(wtHolder)
    Table.append(htMaster)
    document.body.append(Table)
  }

  renderTable(Table)

  it('should render layout correctly', () => {
    const dropDownMenu = renderDropdownMenu(highlighters, Table)

    expect(dropDownMenu).toMatchSnapshot()
  })

  it('should render table with dropdown after click on wrapper layout correctly', () => {
    const wrapper = renderDropdownMenu(highlighters, Table)
    wrapper.click()
    const tableWithDropdown = document.getElementById(TABLE_ID)
    expect(tableWithDropdown).toMatchSnapshot()
  })

  it('should close dropdown after second click', () => {
    const wrapper = renderDropdownMenu(highlighters, Table)
    wrapper.click()
    wrapper.click()
    const tableWithOutDropdown = document.getElementById(TABLE_ID)
    expect(tableWithOutDropdown).toMatchSnapshot()
  })

  it('should close dropdown after click on menuItem', () => {
    const wrapper = renderDropdownMenu(highlighters, Table)
    wrapper.click()

    const menuItem = document.getElementsByTagName('li')[0]
    menuItem.click()

    const tableWithOutDropdown = document.getElementById(TABLE_ID)
    expect(tableWithOutDropdown).toMatchSnapshot()
  })
})
