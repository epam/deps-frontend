
export const chunkArray = (array, size) =>
  Array.from(
    { length: Math.ceil(array.length / size) },
    (_, i) => array.slice(i * size, (i + 1) * size),
  )
