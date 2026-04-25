
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { enginesApi } from '@/api/enginesApi'
import { RESOURCE_OCR_ENGINE } from '@/enums/KnownOCREngine'

export const FEATURE_NAME = 'ENGINES'

const storeOCREngines = createAction(
  `${FEATURE_NAME}/STORE_OCR`,
)

const fetchOCREngines = createRequestAction(
  'fetchOCREngines',
  () => async (dispatch) => {
    const { engines } = await enginesApi.getEngines()

    dispatch(
      storeOCREngines(
        engines.map((engine) => ({
          ...engine,
          name: RESOURCE_OCR_ENGINE[engine.code],
        })),
      ),
    )
  },
)

const storeTableEngines = createAction(
  `${FEATURE_NAME}/STORE_TABLE`,
)

const fetchTableEngines = createRequestAction(
  'fetchTableEngines',
  () => async (dispatch) => {
    dispatch(
      storeTableEngines(
        await enginesApi.getTableEngines(),
      ),
    )
  },
)

export {
  storeTableEngines,
  storeOCREngines,
  fetchTableEngines,
  fetchOCREngines,
}
