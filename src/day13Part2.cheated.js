import fs from 'fs'
import { every } from 'lodash/fp'
import { compact } from 'lodash'
import { solveCRT } from './common/crt'

const parseBuses = (busIdsString) =>
  busIdsString
    .trim()
    .split(',')
    .map((busId, index) => {
      if (busId === 'x') {
        return null
      }
      return { offset: BigInt(index), busId: BigInt(parseInt(busId, 10)) }
    }) |> compact

const parseInput = (file) => {
  const busIdsString = fs.readFileSync(file).toString().trim().split('\n')[1]
  return parseBuses(busIdsString)
}

const earliestMatchSlow = (buses) => {
  var time = -1
  var isMatch = false
  while (!isMatch) {
    time++
    isMatch =
      buses
      |> every((bus) => {
        console.log(bus, time, time + bus.offset, findWaitTime(bus.busId, time + bus.offset))
        return findWaitTime(bus.busId, time + bus.offset) === 0
      })
  }
  return time
}

const earliestMatchFast = (buses) => {
  const crtInput = buses.map((b) => {
    return { n: b.busId, a: b.busId - b.offset }
  })
  return solveCRT(crtInput)
}

const testInput = (buses) => {
  console.log('input', buses)
  // console.log('answer', earliestMatchSlow(buses))
  console.log('fastAnswer', earliestMatchFast(buses))
}

testInput(parseInput('./data/day13.txt'))
