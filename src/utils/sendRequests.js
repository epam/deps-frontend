
export const sendRequests = async (requests, shouldSendSequentially) => {
  if (shouldSendSequentially) {
    for (const request of requests) {
      await request()
    }
  } else {
    const mappedRequests = requests.map((request) => request())
    await Promise.all(mappedRequests)
  }
}
