import fs from 'fs'
import { find, range, map, isNil, take, drop, floor, min as minimum, max as maximum } from 'lodash/fp'

const seats = fs.readFileSync('./data/day5.txt').toString().trim().split('\n')

const binarySpacePartition = ([firstInstruction, ...remainingInstructions], min, max) => {
  if (isNil(firstInstruction)) {
    return min
  }
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

const calculateSeatNumber = (seatCode) => {
  const seatCodeArray = seatCode.split('')
  return row(seatCodeArray) * 8 + column(seatCodeArray)
}

console.log(calculateSeatNumber('FBFBBFFRLR'))

const seatNumbers = seats |> map((s) => calculateSeatNumber(s))

const answer = range(minimum(seatNumbers), maximum(seatNumbers)) |> find((seatNumber) => !seatNumbers.includes(seatNumber))

console.log('answer', answer)
