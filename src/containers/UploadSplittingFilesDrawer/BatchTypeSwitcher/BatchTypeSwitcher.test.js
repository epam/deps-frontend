
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { DefaultFormValues, FIELD_FORM_CODE } from '../constants'
import { BatchTypeSwitcher } from '.'

jest.mock('@/utils/env', () => mockEnv)

test('renders toggle correctly', () => {
  const defaultProps = {
    onChange: jest.fn(),
    value: DefaultFormValues[FIELD_FORM_CODE.BATCH_TYPE],
  }

  render(<BatchTypeSwitcher {...defaultProps} />)

  expect(screen.getByText(localize(Localization.ONE_BATCH))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.MULTI_BATCHES))).toBeInTheDocument()
})
