
class ForceGCPlugin {
  constructor ({
    interval,
    verbose
  }) {
    this.interval = interval
    this.verbose = verbose
  }

  compilation = false

  scheduleGc = () => {
    if (!global.gc) {
      console.warn('GC is not exposed! Please run node with --expose-gc flag')
      return
    }

    this.compilation && setTimeout(
      () => {
        global.gc()
        this.verbose && console.log('Executing force gc. Memory usage:', process.memoryUsage())
        this.scheduleGc()
      },
      this.interval
    )
  }

  apply (compiler) {
    compiler.hooks.initialize.tap(
      'ForceGCPlugin',
      () => {
        this.compilation = true
        this.scheduleGc()
      }
    )

    compiler.hooks.done.tap(
      'ForceGCPlugin',
      () => {
        this.compilation = false
      }
    )
  }
}

module.exports = ForceGCPlugin
