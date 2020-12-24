import fs from 'fs'
import { isEmpty, countBy, toPairs, times, sortBy, size } from 'lodash'
import { find, flatMap, filter } from 'lodash/fp'

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

const run = (inputString) => {
  const tiles = parseTiles(inputString)
  console.log('tiles', tiles)
  const minimalTiles = tiles.map(minimalTileDirections)
  console.log('minimalTiles', minimalTiles)
  const answer = minimalTiles.map((t) => t.join(',')) |> countBy |> filter(isOdd) |> size
  console.log('answer', answer)
  console.log('\n')
}

if (process.env.NODE_ENV !== 'test') {
  const example1 = `esew`
  const example2 = `eeeewww`
  const example3 = `nese`
  const example4 = `swwesenesewenwneswnwwneseswwne`
  const example5 = `eesenwseswswnenwswnwnwsewwnwsene`
  run(example1)
  run(example2)
  run(example3)
  run(example4)
  run(example5)
  run(readFile('./data/day24Example.txt'))
  run(readFile('./data/day24.txt'))
}
