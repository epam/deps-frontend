
import {
  setActiveLayoutId,
  setActiveTable,
  storeKeyToAssign,
  toggleAddFieldDrawer,
} from '@/actions/prototypePage'
import { prototypePageReducer } from './prototypePage'

const initialState = {
  keyToAssign: null,
  activeLayoutId: null,
}

describe('Reducer: prototypePageReducer', () => {
  describe('Action handler: storeKeyToAssign', () => {
    it('should set key to the state', () => {
      const key = 'mockKey'
      const expectedState = {
        ...initialState,
        keyToAssign: key,
      }
      const action = storeKeyToAssign(key)
      expect(prototypePageReducer(initialState, action)).toEqual(expectedState)
    })
  })

  describe('Action handler: setActiveLayoutId', () => {
    it('should set correct id to the state', () => {
      const activeLayoutId = 'mockId'
      const expectedState = {
        ...initialState,
        activeLayoutId,
      }
      const action = setActiveLayoutId(activeLayoutId)
      expect(prototypePageReducer(initialState, action)).toEqual(expectedState)
    })
  })

  describe('Action handler: setActiveTable', () => {
    it('should set correct id to the state', () => {
      const activeTable = ['mockTable']
      const expectedState = {
        ...initialState,
        activeTable,
      }
      const action = setActiveTable(activeTable)
      expect(prototypePageReducer(initialState, action)).toEqual(expectedState)
    })
  })

  describe('Action handler: toggleAddFieldDrawer', () => {
    it('should set correct showTableDrawer value to the state', () => {
      const showTableDrawer = true
      const expectedState = {
        ...initialState,
        showTableDrawer,
      }
      const action = toggleAddFieldDrawer()
      expect(prototypePageReducer(initialState, action)).toEqual(expectedState)
    })
  })
})
