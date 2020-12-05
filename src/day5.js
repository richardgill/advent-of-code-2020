import fs from 'fs'
import { map, isNil, take, drop, floor, max as maximum } from 'lodash/fp'

const seats = fs.readFileSync('./data/day5.txt').toString().trim().split('\n')

const binarySpacePartition = ([firstInstruction, ...remainingInstructions], min, max) => {
  if (isNil(firstInstruction)) {
    return min
  }

  console.log('min max', min, max)
  console.log('firstInstruction', firstInstruction)
  const diff = floor((max - min) / 2)
  if (firstInstruction === 'LOWER') {
    return binarySpacePartition(remainingInstructions, min, min + diff)
  }
  return binarySpacePartition(remainingInstructions, max - diff, max)
}

const row = (seatNumberArray) => {
  const rowInstructions = seatNumberArray |> take(7) |> map((i) => (i === 'B' ? 'UPPER' : 'LOWER'))
  return binarySpacePartition(rowInstructions, 0, 127)
}
const column = (seatNumberArray) => {
  const columnInstructions = seatNumberArray |> drop(7) |> map((i) => (i === 'L' ? 'LOWER' : 'UPPER'))
  return binarySpacePartition(columnInstructions, 0, 7)
}

const seatNumber = (seatCode) => {
  const seatCodeArray = seatCode.split('')
  console.log('row', row(seatCodeArray))
  console.log('column', column(seatCodeArray))
  return row(seatCodeArray) * 8 + column(seatCodeArray)
}

console.log(seatNumber('FBFBBFFRLR'))
console.log(seats)

const answer = seats |> map((s) => seatNumber(s)) |> maximum

console.log('answer', answer)
