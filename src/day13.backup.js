import fs from 'fs'
import { sortBy, every } from 'lodash/fp'
import { first, compact, drop } from 'lodash'
import { lcm } from 'mathjs'

const parseBuses = (busIdsString) =>
  busIdsString
    .trim()
    .split(',')
    .map((busId, index) => {
      if (busId === 'x') {
        return null
      }
      return { offset: index, busId: parseInt(busId, 10) }
    }) |> compact

const parseInput = (file) => {
  const busIdsString = fs.readFileSync(file).toString().trim().split('\n')[1]
  return parseBuses(busIdsString)
}

const findWaitTime = (busId, earliestDepartTime) => {
  // return busId - (earliestDepartTime % busId)
  return earliestDepartTime % busId
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

// const calcOffset = (bus1, bus2) => {
//   const firstBus1Value = Math.ceil(bus1.busId / bus2.busId) * bus2.busId
//   console.log('firstBus1Value', firstBus1Value)
//   const missedBy = bus2.busId - firstBus1Value - bus2.offset
//   const shift = bus2.busId - firstBus1Value
//   console.log('missedBy', missedBy)
//   console.log('shift', shift)
//   const x = ((bus2.busId - missedBy) / shift + 1) % bus2.busId
//   console.log('x', x)
//   return x * bus1.busId
// }
const calcOffset = (bus1, bus2) => {
  console.log('bus1'.bus1)
  console.log('bus1'.bus1)
  return x * bus1.busId
}

const earliestMatchFast = (buses) => {
  if (buses.length === 1) {
    return buses[0]
  }
  const bus1 = buses[0]
  const bus2 = buses[1]
  console.log('lcm', lcm(bus1.busId, bus2.busId))
  console.log('bus2Id', bus2.busId)
  console.log('bus2Offset', bus2.offset)
  const result = { busId: lcm(bus1.busId, bus2.busId), offset: calcOffset(bus1, bus2) }
  return earliestMatchFast([result, ...drop(buses, 2)])
}

const testInput = (buses) => {
  console.log('input', buses)
  console.log('answer', earliestMatchSlow(buses))
  console.log('fastAnswer', earliestMatchFast(buses))
  // const fastestBus =
  //   busIds.map((busId) => ({ busId, waitTime: findWaitTime(busId, earliestDepartTime) })) |> sortBy('waitTime') |> first

  // console.log('fastestBus', fastestBus)
  // console.log('answer', fastestBus.busId * fastestBus.waitTime)
}

// testInput(parseBuses('1,2'))
// testInput(parseBuses('1,3'))
// testInput(parseBuses('1,4'))

// testInput(parseBuses('1,2,3'))

// testInput(parseBuses('2,3'))
testInput(parseBuses('5,7'))
testInput(parseBuses('2,5'))
testInput(parseBuses('3,5'))
testInput(parseBuses('3,4'))
testInput(parseBuses('5,2'))
// testInput(parseBuses('4,3'))
// testInput(parseBuses('2,3,5'))
// testInput(parseBuses('2,5'))
// testInput(parseBuses('2,7'))
// testInput(parseBuses('2,9'))
// testInput(parseBuses('3,5'))
// testInput(parseBuses('3,7'))
// testInput(parseBuses('3,10'))
// testInput(parseBuses('17,x,13,19'))
// testInput(parseBuses('67,7,59,61'))
// testInput(parseBuses('67,x,7,59,61'))
// testInput(parseBuses('67,7,x,59,61'))
// testInput(parseBuses('1789,37,47,1889'))
// testInput(parseInput('./data/day13Example.txt'))
// testInput(parseInput('./data/day13.txt'))
