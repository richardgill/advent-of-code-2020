import fs from 'fs'
import { isEmpty, countBy, toPairs, times, differenceBy, values, sortBy, drop, flatten } from 'lodash'
import { find, flatMap, filter, map, uniqBy } from 'lodash/fp'

const readFile = (file) => {
  return fs.readFileSync(file).toString().trim()
}

const TILES = ['se', 'sw', 'nw', 'ne', 'w', 'e']

const parseTile = (tileString) => {
  if (isEmpty(tileString)) {
    return []
  }
  const tile = TILES |> find((t) => tileString.startsWith(t))
  return [tile, ...parseTile(tileString.slice(tile.length))]
}

const parseTiles = (inputString) => {
  return inputString.trim().split('\n').map(parseTile)
}

const RULES = [
  [['sw', 'nw'], ['w']],
  [['se', 'ne'], ['e']],
  [['ne', 'w'], ['nw']],
  [['nw', 'e'], ['ne']],
  [['se', 'w'], ['sw']],
  [['sw', 'e'], ['se']],
  [['ne', 'se'], ['e']],
  [['nw', 'sw'], ['w']],
  [['se', 'nw'], []],
  [['w', 'e'], []],
  [['ne', 'sw'], []],
]

const minimalTileDirections = (tile) => {
  const directionCounts = countBy(tile)
  const rule = RULES.find(([[d1, d2]]) => {
    return directionCounts[d1] > 0 && directionCounts[d2] > 0
  })
  if (!rule) {
    return tile
  }
  const [[direction1, direction2], replaceWith] = rule
  directionCounts[direction1] -= 1
  directionCounts[direction2] -= 1
  replaceWith.forEach((direction) => {
    directionCounts[direction] = (directionCounts[direction] || 0) + 1
  })
  const newTiles = directionCounts |> toPairs |> flatMap(([direction, count]) => times(count, () => direction))
  return minimalTileDirections(sortBy(newTiles, (x) => x))
}

const isOdd = (n) => n % 2 !== 0

const DIRECTION_TO_COORD_DIFF = { ne: [1, 0, -1], e: [1, -1, 0], se: [0, -1, 1], sw: [-1, 0, 1], w: [-1, 1, 0], nw: [0, 1, -1] }

const tileToCoordinates = (tile, coordinate = [0, 0, 0]) => {
  if (isEmpty(tile) || tile[0] === '') {
    return coordinate
  }
  const [xDiff, yDiff, zDiff] = DIRECTION_TO_COORD_DIFF[tile[0]]
  const newCoordinate = [coordinate[0] + xDiff, coordinate[1] + yDiff, coordinate[2] + zDiff]
  return tileToCoordinates(drop(tile, 1), newCoordinate)
}

const isAdjacent = ([x1, y1, z1], [x2, y2, z2]) => {
  const xDiff = x1 - x2
  const yDiff = y1 - y2
  const zDiff = z1 - z2
  return (
    xDiff >= -1 &&
    xDiff <= 1 &&
    yDiff >= -1 &&
    yDiff <= 1 &&
    zDiff >= -1 &&
    zDiff <= 1 &&
    !(xDiff === 0 && yDiff === 0 && zDiff === 0)
  )
}

const isStillActive = (tile, activeTiles) => {
  const adjacentActiveTileCount = activeTiles.filter((activeTile) => isAdjacent(tile, activeTile)).length
  return adjacentActiveTileCount > 0 && adjacentActiveTileCount <= 2
}

const isNowActive = (tile, activeTiles) => {
  const adjacentActiveTileCount = activeTiles.filter((activeTile) => isAdjacent(tile, activeTile)).length
  return adjacentActiveTileCount === 2
}

const calcNeighbours = (tile) => {
  const [x, y, z] = tile
  return values(DIRECTION_TO_COORD_DIFF).map(([xDiff, yDiff, zDiff]) => [x + xDiff, y + yDiff, z + zDiff])
}

const tileCoordinateToString = (tile) => tile.join(',')

const simulateDay = (activeTiles) => {
  const adjacentTilesToCheck = activeTiles.map(calcNeighbours) |> flatten |> uniqBy(tileCoordinateToString)
  const adjacentWhiteTilesToCheck = differenceBy(adjacentTilesToCheck, activeTiles, tileCoordinateToString)
  const whiteTilesNowActive = adjacentWhiteTilesToCheck.filter((tile) => isNowActive(tile, activeTiles))
  const stillActiveTiles = activeTiles.filter((tile) => isStillActive(tile, activeTiles))
  return [...stillActiveTiles, ...whiteTilesNowActive]
}

const simulateDays = (activeTiles, days = 100) => {
  if (days === 0) {
    return activeTiles
  }
  const newActiveTiles = simulateDay(activeTiles)
  console.log(`day: ${days} newActiveTiles.length`, newActiveTiles.length)
  return simulateDays(newActiveTiles, days - 1)
}

const run = (inputString) => {
  const tiles = parseTiles(inputString)
  const minimalTiles = tiles.map(minimalTileDirections)
  const blackTiles =
    // eslint-disable-next-line no-unused-vars
    minimalTiles.map((t) => t.join(',')) |> countBy |> toPairs |> filter(([t, count]) => isOdd(count)) |> map(([t]) => t)
  const activeTiles = blackTiles.map((tile) => tileToCoordinates(tile.split(',')))
  const endTiles = simulateDays(activeTiles, 100)
  const answer = endTiles.length
  console.log('answer', answer)
  console.log('\n')
}

if (process.env.NODE_ENV !== 'test') {
  // const example1 = `esew`
  // const example2 = `eeeewww`
  // const example3 = `nese`
  // const example4 = `swwesenesewenwneswnwwneseswwne`
  // const example5 = `eesenwseswswnenwswnwnwsewwnwsene`
  // run(example1)
  // run(example2)
  // run(example3)
  // run(example4)
  // run(example5)
  run(readFile('./data/day24Example.txt'))
  run(readFile('./data/day24.txt'))
}
