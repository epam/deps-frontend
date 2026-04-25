
class RequestStack {
  constructor () {
    this.queue = []
    this.ALLOWED_TO_FIRE_SIMULTANEOUSLY = 10
    this.currentlyFiring = 0
  }

  fire () {
    if (this.currentlyFiring === this.ALLOWED_TO_FIRE_SIMULTANEOUSLY) {
      return
    }

    if (!this.queue.length) {
      return
    }

    const callback = this.queue.pop()

    this.currentlyFiring += 1
    callback().then((data) => {
      this.currentlyFiring -= 1
      this.fire()
      return data
    })
    this.fire()
  }

  add (request) {
    this.queue.push(request)
    this.fire()

    return () => {
      this.queue = this.queue.filter((req) => req !== request)
    }
  }
}

export {
  RequestStack,
}
