
const notifySuccess = jest.fn()
const notifyError = jest.fn()
const notifyWarning = jest.fn()
const notifyInfo = jest.fn()

const notifyProgress = jest.fn()

const notifyRequest = jest.fn((request) =>
  async ({ fetching, success, warning }) => {
    notifyProgress(fetching)
    try {
      const data = await request
      success && notifySuccess(success)
      return data
    } catch (e) {
      warning && notifyWarning(warning)
      throw e
    }
  },
)

const mockNotification = {
  notifyProgress,
  notifyError,
  notifyRequest,
  notifyInfo,
  notifySuccess,
  notifyWarning,
}

export { mockNotification }
