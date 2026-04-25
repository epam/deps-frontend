
import { EventEmitter } from './EventEmitter'

const mockEvent = new EventEmitter()
const mockEventHandler = jest.fn()

describe('Model EventEmitter:', () => {
  it('should subscribe eventHandler', () => {
    mockEvent.subscribe(mockEventHandler)
    expect(mockEvent.listener).toEqual(mockEventHandler)
  })

  it('should call listener when fire called', () => {
    mockEvent.fire()
    expect(mockEventHandler).toHaveBeenCalled()
  })
})
