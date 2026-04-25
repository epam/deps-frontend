
const mapSourceTableCoordinatesToTableCoordinates = (coords) => (
  coords && Object.values(coords).reduce((sum, coords) => {
    if (coords) {
      sum.push(coords.row, coords.column)
    }

    return sum
  }, [])
)

export {
  mapSourceTableCoordinatesToTableCoordinates,
}
