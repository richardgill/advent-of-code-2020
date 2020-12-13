import fs from 'fs'
import { sortBy } from 'lodash/fp'
import { first } from 'lodash'

const parseInput = (file) => {
  const [earliestDepartTimeString, busIdsString] = fs.readFileSync(file).toString().trim().split('\n')
  const earliestDepartTime = parseInt(earliestDepartTimeString, 10)
  const busIds = busIdsString
    .trim()
    .split(',')
    .filter((busId) => busId !== 'x')
    .map((busId) => parseInt(busId, 10))
  return { earliestDepartTime, busIds }
}

const findWaitTime = (busId, earliestDepartTime) => {
  return busId - (earliestDepartTime % busId)
}

const testInput = ({ earliestDepartTime, busIds }) => {
  const fastestBus =
    busIds.map((busId) => ({ busId, waitTime: findWaitTime(busId, earliestDepartTime) })) |> sortBy('waitTime') |> first

  console.log('fastestBus', fastestBus)
  console.log('answer', fastestBus.busId * fastestBus.waitTime)
}

testInput(parseInput('./data/day13Example.txt'))
testInput(parseInput('./data/day13.txt'))
