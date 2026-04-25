
class EventEmitter {
  listener = null

  subscribe = (listener) => {
    this.listener = listener

    return () => {
      this.listener = null
    }
  }

  fire = () => this.listener && this.listener()
}

export { EventEmitter }
