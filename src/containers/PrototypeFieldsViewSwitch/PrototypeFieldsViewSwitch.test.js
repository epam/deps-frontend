
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { PrototypeFieldsViewSwitch } from './PrototypeFieldsViewSwitch'

jest.mock('@/utils/env', () => mockEnv)

test('shows correct switcher layout', async () => {
  render(
    <PrototypeFieldsViewSwitch
      fieldsViewType={PrototypeViewType.FIELDS}
      setFieldsViewType={jest.fn()}
    />,
  )

  const fieldsOption = screen.getByRole('radio', {
    name: localize(Localization.FIELDS_TAB_NAME),
  })
  const tablesOption = screen.getByRole('radio', {
    name: localize(Localization.TABLES),
  })

  expect(fieldsOption.value).toEqual(PrototypeViewType.FIELDS)
  expect(fieldsOption).toBeChecked()
  expect(tablesOption.value).toEqual(PrototypeViewType.TABLES)
  expect(tablesOption).not.toBeChecked()
})

test('calls setFieldsViewType with correct parameters when switcher is toggled', async () => {
  const mockSetFieldsViewType = jest.fn()

  render(
    <PrototypeFieldsViewSwitch
      fieldsViewType={PrototypeViewType.FIELDS}
      setFieldsViewType={mockSetFieldsViewType}
    />,
  )

  const tablesOption = screen.getByRole('radio', {
    name: localize(Localization.TABLES),
  })

  await userEvent.click(tablesOption)

  expect(mockSetFieldsViewType).nthCalledWith(1, PrototypeViewType.TABLES)
})
