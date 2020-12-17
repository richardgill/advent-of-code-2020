import fs from 'fs'
import { range, times, get, compact, flatten, flattenDeep } from 'lodash'
import Iter from 'es-iter'

const readFile = (file) => {
  return fs.readFileSync(file).toString().trim()
}

const parseInput = (inputString) => {
  return inputString
    .trim()
    .split('\n')
    .map((line) => line.split(''))
}

const GRID_SIZE_BUFFER = 0
const makeGridInfinite = (state, cycles) => {
  const gridSize = state.length + cycles * 2 + GRID_SIZE_BUFFER
  const zwToInsert = Math.floor(gridSize / 2)
  const startInsertIndex = (gridSize - state.length) / 2
  const endInsertIndex = gridSize - startInsertIndex - 1
  return times(gridSize, (w) =>
    times(gridSize, (z) =>
      times(gridSize, (y) =>
        times(gridSize, (x) => {
          if (
            zwToInsert === w &&
            zwToInsert === z &&
            y >= startInsertIndex &&
            y <= endInsertIndex &&
            x >= startInsertIndex &&
            x <= endInsertIndex
          ) {
            return state[y - startInsertIndex][x - startInsertIndex]
          }
          return '.'
        }),
      ),
    ),
  )
}

const printState = (state) => {
  const toPrint = state
    .map((zPlane) => zPlane.map((yPlane) => yPlane.map((xPlane) => xPlane.join('')).join('\n')).join('\n\n'))
    .join('\n\n')
  console.log(toPrint)
}

const calculateNewValue = (currentValue, adjacentValues) => {
  const adjacentActiveCount = adjacentValues.filter((av) => av === '#').length
  if (currentValue === '#') {
    return [2, 3].includes(adjacentActiveCount) ? '#' : '.'
  }
  return adjacentActiveCount === 3 ? '#' : '.'
}

const calculateAdajacentValues = (state, w, z, y, x) => {
  const adjacentIndexes = new Iter([w, w + 1, w - 1])
    .product([z, z + 1, z - 1])
    .product([y, y + 1, y - 1])
    .product([x, x + 1, x - 1])
    .toArray()
    .map(flattenDeep)
    // remove original coordinates
    .filter(([w0, z0, y0, x0]) => !(w0 === w && z0 === z && y0 === y && x0 === x))
  return adjacentIndexes.map((indexes) => get(state, indexes)) |> compact
}

const runCycle = (state) => {
  return state.map((wPlane, w) => {
    return wPlane.map((zPlane, z) => {
      return zPlane.map((yPlane, y) => {
        return yPlane.map((value, x) => {
          const adjacentValues = calculateAdajacentValues(state, w, z, y, x)
          const newValue = calculateNewValue(value, adjacentValues)
          return newValue
        })
      })
    })
  })
}

const CYCLES = 6

const testInput = (input) => {
  const initialState = parseInput(input)
  console.log('initialState', initialState)
  let infiniteGrid = makeGridInfinite(initialState, CYCLES)
  console.log('infiniteGrid')
  printState(infiniteGrid)

  range(1, CYCLES + 1).forEach((cycle) => {
    infiniteGrid = runCycle(infiniteGrid)
    console.log(`\n\nafter cycle ${cycle}`)
    // printState(infiniteGrid)
  })
  const answer = flattenDeep(infiniteGrid).filter((x) => x === '#').length
  console.log('answer', answer)
}

const input1 = `.#.
..#
###
`

testInput(input1)
testInput(readFile('./data/day17.txt'))
