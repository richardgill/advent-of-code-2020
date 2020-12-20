import { drop, isEmpty, last, unzip, first, some, isEqual, sum } from 'lodash'
// import { keyBy } from 'lodash/fp'
import fs from 'fs'

const readFile = (file) => {
  return fs.readFileSync(file).toString().trim()
}

const product = (array) => {
  if (isEmpty(array)) {
    return 1
  }
  return first(array) * product(drop(array, 1))
}

const parseTiles = (tilesString) => {
  return tilesString
    .trim()
    .split('\n\n')
    .map((tile) => {
      const lines = tile.split('\n')
      const tileId = lines[0].match(/Tile (\d+)/)[1]
      const image = drop(lines, 1).map((l) => l.split(''))
      return { tileId, image }
    })
}

const topBorder = (tile) => first(tile.image)
const bottomBorder = (tile) => last(tile.image)
const leftBorder = (tile) => first(unzip(tile.image))
const rightBorder = (tile) => last(unzip(tile.image))

const allPossibleBorders = (tile) => {
  return [topBorder(tile), bottomBorder(tile), leftBorder(tile), rightBorder(tile)].flatMap((border) => [
    border,
    border.slice().reverse(),
  ])
}

const isAdjacent = (tile1, tile2) => {
  return some(allPossibleBorders(tile1), (border1) => some(allPossibleBorders(tile2), (border2) => isEqual(border1, border2)))
}

const withoutIndex = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)]

const attachAdjacentTiles = (tiles) => {
  return tiles.map((tile, index) => {
    const otherTiles = withoutIndex(tiles, index)
    const adjacent = otherTiles.filter((otherTile) => isAdjacent(tile, otherTile))
    return { ...tile, adjacent }
  })
}

const run = (inputString) => {
  const tiles = attachAdjacentTiles(parseTiles(inputString))
  const answer = tiles.filter((tile) => tile.adjacent.length === 2).map((t) => t.tileId) |> product
  console.log('answer: ', answer)
}

if (process.env.NODE_ENV !== 'test') {
  run(readFile('./data/day20Example.txt'))
  run(readFile('./data/day20.txt'))
}
