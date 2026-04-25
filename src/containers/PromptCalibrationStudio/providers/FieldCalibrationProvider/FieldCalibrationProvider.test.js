
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import { CALIBRATION_MODE, DEFAULT_EXTRACTOR } from '@/containers/PromptCalibrationStudio/constants'
import {
  Field,
  Query,
  Extractor,
  MULTIPLICITY,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { render } from '@/utils/rendererRTL'
import { FieldCalibrationProvider, FieldCalibrationContext } from './FieldCalibrationProvider'

jest.mock('@/utils/env', () => mockEnv)

const mockField = new Field({
  id: 'field-1',
  name: 'Test Field',
  extractorId: 'extractor-1',
  fieldType: FieldType.STRING,
  multiplicity: MULTIPLICITY.SINGLE,
  query: new Query({}),
})

const mockDefaultExtractor = new Extractor({
  id: 'default-extractor',
  name: 'Default Extractor',
  model: 'test-model',
  temperature: 0.7,
  topP: 0.9,
  groupingFactor: 1,
})

const mockField2 = new Field({
  id: 'field-2',
  name: 'Test Field 2',
  extractorId: 'extractor-1',
  fieldType: FieldType.STRING,
  multiplicity: MULTIPLICITY.SINGLE,
  query: new Query({}),
})

const MockComponent = () => {
  const {
    calibrationMode,
    setCalibrationMode,
    activeField,
    setActiveField,
    fields,
    deleteField,
    addField,
    closeCalibrationMode,
    updateFields,
    batchUpdateFields,
    updateFieldsAndClose,
  } = useContext(FieldCalibrationContext)

  return (
    <div>
      <p data-testid="calibration-mode">
        {calibrationMode || 'null'}
      </p>
      <p data-testid="active-field-id">
        {activeField?.id || 'null'}
      </p>
      <p data-testid="fields">
        {fields.length}
      </p>
      <p data-testid="field-names">
        {fields.map((f) => f.name).join(',')}
      </p>
      <button onClick={() => setCalibrationMode(CALIBRATION_MODE.ADVANCED)}>
        Set Advanced Mode
      </button>
      <button onClick={() => setActiveField(mockField)}>
        Set Active Field
      </button>
      <button onClick={() => setCalibrationMode(null)}>
        Clear Mode
      </button>
      <button onClick={() => setActiveField(null)}>
        Clear Field
      </button>
      <button onClick={() => addField([...fields, mockField])}>
        Add Field
      </button>
      <button onClick={() => deleteField('field-1')}>
        Delete Field
      </button>
      <button onClick={() => closeCalibrationMode()}>
        Close Calibration Mode
      </button>
      <button onClick={
        () => updateFields({
          ...mockField,
          name: 'Updated Field',
        })
      }
      >
        Update Field
      </button>
      <button onClick={
        () => updateFieldsAndClose({
          ...mockField,
          name: 'Updated And Closed',
        })
      }
      >
        Update Fields And Close
      </button>
      <button onClick={
        () => batchUpdateFields({
          'field-1': {
            ...mockField,
            name: 'Batch Updated 1',
          },
          'field-2': {
            ...mockField2,
            name: 'Batch Updated 2',
          },
        })
      }
      >
        Batch Update Fields
      </button>
    </div>
  )
}

test('provides initial context values to children', () => {
  const props = {
    initialFields: [],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const calibrationMode = screen.getByTestId('calibration-mode')
  const activeFieldId = screen.getByTestId('active-field-id')
  const fields = screen.getByTestId('fields')

  expect(calibrationMode).toHaveTextContent('null')
  expect(activeFieldId).toHaveTextContent('null')
  expect(fields).toHaveTextContent('0')
})

test('updates calibrationMode when setCalibrationMode is called', async () => {
  const props = {
    initialFields: [],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const setAdvancedModeBtn = screen.getByRole('button', { name: 'Set Advanced Mode' })
  await userEvent.click(setAdvancedModeBtn)

  await waitFor(() => {
    const calibrationMode = screen.getByTestId('calibration-mode')
    expect(calibrationMode).toHaveTextContent(CALIBRATION_MODE.ADVANCED)
  })
})

test('updates activeField when setActiveField is called', async () => {
  const props = {
    initialFields: [],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const setActiveFieldBtn = screen.getByRole('button', { name: 'Set Active Field' })
  await userEvent.click(setActiveFieldBtn)

  await waitFor(() => {
    const activeFieldId = screen.getByTestId('active-field-id')
    expect(activeFieldId).toHaveTextContent('field-1')
  })
})

test('clears calibrationMode when set to null', async () => {
  const props = {
    initialFields: [],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const setAdvancedModeBtn = screen.getByRole('button', { name: 'Set Advanced Mode' })
  await userEvent.click(setAdvancedModeBtn)

  await waitFor(() => {
    const calibrationMode = screen.getByTestId('calibration-mode')
    expect(calibrationMode).toHaveTextContent(CALIBRATION_MODE.ADVANCED)
  })

  const clearModeBtn = screen.getByRole('button', { name: 'Clear Mode' })
  await userEvent.click(clearModeBtn)

  await waitFor(() => {
    const calibrationMode = screen.getByTestId('calibration-mode')
    expect(calibrationMode).toHaveTextContent('null')
  })
})

test('clears activeField when set to null', async () => {
  const props = {
    initialFields: [],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const setActiveFieldBtn = screen.getByRole('button', { name: 'Set Active Field' })
  await userEvent.click(setActiveFieldBtn)

  await waitFor(() => {
    const activeFieldId = screen.getByTestId('active-field-id')
    expect(activeFieldId).toHaveTextContent('field-1')
  })

  const clearFieldBtn = screen.getByRole('button', { name: 'Clear Field' })
  await userEvent.click(clearFieldBtn)

  await waitFor(() => {
    const activeFieldId = screen.getByTestId('active-field-id')
    expect(activeFieldId).toHaveTextContent('null')
  })
})

test('renders children correctly', () => {
  const mockTestId = 'test-id'

  const props = {
    initialFields: [],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <div data-testid={mockTestId} />
    </FieldCalibrationProvider>,
  )

  expect(screen.getByTestId(mockTestId)).toBeInTheDocument()
})

test('adds field when addField is called', async () => {
  const props = {
    initialFields: [],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const addFieldBtn = screen.getByRole('button', { name: 'Add Field' })
  await userEvent.click(addFieldBtn)

  await waitFor(() => {
    const fields = screen.getByTestId('fields')
    expect(fields).toHaveTextContent('1')
  })
})

test('closeCalibrationMode clears calibrationMode and activeField', async () => {
  const props = {
    initialFields: [],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const closeCalibrationModeBtn = screen.getByRole('button', { name: 'Close Calibration Mode' })
  await userEvent.click(closeCalibrationModeBtn)

  await waitFor(() => {
    expect(screen.getByTestId('calibration-mode')).toHaveTextContent('null')
  })

  await waitFor(() => {
    expect(screen.getByTestId('active-field-id')).toHaveTextContent('null')
  })
})

test('deleteField removes field from fields list', async () => {
  const props = {
    initialFields: [mockField],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  expect(screen.getByTestId('fields')).toHaveTextContent('1')

  const deleteFieldBtn = screen.getByRole('button', { name: 'Delete Field' })
  await userEvent.click(deleteFieldBtn)

  await waitFor(() => {
    expect(screen.getByTestId('fields')).toHaveTextContent('0')
  })
})

test('deleteField clears calibrationMode when active field is deleted', async () => {
  const props = {
    initialFields: [mockField],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const setAdvancedModeBtn = screen.getByRole('button', { name: 'Set Advanced Mode' })
  const setActiveFieldBtn = screen.getByRole('button', { name: 'Set Active Field' })

  await userEvent.click(setAdvancedModeBtn)
  await userEvent.click(setActiveFieldBtn)

  await waitFor(() => {
    expect(screen.getByTestId('calibration-mode')).toHaveTextContent(CALIBRATION_MODE.ADVANCED)
  })

  const deleteFieldBtn = screen.getByRole('button', { name: 'Delete Field' })
  await userEvent.click(deleteFieldBtn)

  await waitFor(() => {
    expect(screen.getByTestId('calibration-mode')).toHaveTextContent('null')
  })
})

test('deleteField clears activeField when active field is deleted', async () => {
  const props = {
    defaultExtractor: mockDefaultExtractor,
    initialFields: [mockField],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const setActiveFieldBtn = screen.getByRole('button', { name: 'Set Active Field' })
  await userEvent.click(setActiveFieldBtn)

  await waitFor(() => {
    expect(screen.getByTestId('active-field-id')).toHaveTextContent('field-1')
  })

  const deleteFieldBtn = screen.getByRole('button', { name: 'Delete Field' })
  await userEvent.click(deleteFieldBtn)

  await waitFor(() => {
    expect(screen.getByTestId('active-field-id')).toHaveTextContent('null')
  })
})

test('deleteField calls setCalibrationValues with updated fields and extractors', async () => {
  const setCalibrationValuesMock = jest.fn()

  const props = {
    initialFields: [mockField],
    setCalibrationValues: setCalibrationValuesMock,
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const deleteFieldBtn = screen.getByRole('button', { name: 'Delete Field' })
  await userEvent.click(deleteFieldBtn)

  await waitFor(() => {
    expect(setCalibrationValuesMock).toHaveBeenCalledWith({
      fields: [],
      extractors: [DEFAULT_EXTRACTOR],
      initialFields: [mockField],
      initialExtractors: undefined,
      calibrationMode: null,
    })
  })
})

test('calls setCalibrationValues with initialFields and initialExtractors when field is added', async () => {
  const mockSetCalibrationValues = jest.fn()
  const initialFields = []
  const initialExtractors = [mockDefaultExtractor]

  const props = {
    initialFields,
    initialExtractors,
    setCalibrationValues: mockSetCalibrationValues,
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const addFieldBtn = screen.getByRole('button', { name: 'Add Field' })
  await userEvent.click(addFieldBtn)

  await waitFor(() => {
    expect(mockSetCalibrationValues).toHaveBeenCalledWith(
      expect.objectContaining({
        initialFields,
        initialExtractors,
      }),
    )
  })
})

test('updateFields calls setCalibrationValues with updated fields', async () => {
  const mockSetCalibrationValues = jest.fn()

  const props = {
    initialFields: [mockField],
    setCalibrationValues: mockSetCalibrationValues,
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const updateFieldBtn = screen.getByRole('button', { name: 'Update Field' })
  await userEvent.click(updateFieldBtn)

  await waitFor(() => {
    expect(mockSetCalibrationValues).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: [expect.objectContaining({ name: 'Updated Field' })],
      }),
    )
  })
})

test('batchUpdateFields updates multiple fields in the fields list', async () => {
  const props = {
    initialFields: [mockField, mockField2],
    setCalibrationValues: jest.fn(),
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  expect(screen.getByTestId('field-names')).toHaveTextContent('Test Field,Test Field 2')

  const batchUpdateBtn = screen.getByRole('button', { name: 'Batch Update Fields' })
  await userEvent.click(batchUpdateBtn)

  await waitFor(() => {
    expect(screen.getByTestId('field-names')).toHaveTextContent('Batch Updated 1,Batch Updated 2')
  })
})

test('batchUpdateFields calls setCalibrationValues with updated fields', async () => {
  const mockSetCalibrationValues = jest.fn()

  const props = {
    initialFields: [mockField, mockField2],
    setCalibrationValues: mockSetCalibrationValues,
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const batchUpdateBtn = screen.getByRole('button', { name: 'Batch Update Fields' })
  await userEvent.click(batchUpdateBtn)

  await waitFor(() => {
    expect(mockSetCalibrationValues).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: [
          expect.objectContaining({ name: 'Batch Updated 1' }),
          expect.objectContaining({ name: 'Batch Updated 2' }),
        ],
      }),
    )
  })
})

test('updateFieldsAndClose calls setCalibrationValues with updated fields and null mode', async () => {
  const mockSetCalibrationValues = jest.fn()

  const props = {
    initialFields: [mockField],
    setCalibrationValues: mockSetCalibrationValues,
  }

  render(
    <FieldCalibrationProvider {...props}>
      <MockComponent />
    </FieldCalibrationProvider>,
  )

  const updateFieldsAndCloseBtn = screen.getByRole('button', { name: 'Update Fields And Close' })
  await userEvent.click(updateFieldsAndCloseBtn)

  await waitFor(() => {
    expect(mockSetCalibrationValues).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: [expect.objectContaining({ name: 'Updated And Closed' })],
        calibrationMode: null,
      }),
    )
  })
})
