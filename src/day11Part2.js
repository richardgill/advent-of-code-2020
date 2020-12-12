import fs from 'fs'
import { filter } from 'lodash/fp'
import { compact, isNil, get, size, flatten, isEqual } from 'lodash'

const EMPTY_SEAT = 'L'
const OCCUPIED_SEAT = '#'

const parseInput = (file) =>
  fs
    .readFileSync(file)
    .toString()
    .trim()
    .split('\n')
    .map((row) => row.split(''))

// const printSeats = (seats) => {
//   seats.forEach((col) => {
//     col.forEach((seat) => {
//       process.stdout.write(`${seat} `)
//     })
//     console.log('\n')
//   })
//   console.log('\n')
// }

// null safe
const getSeat = (x, y, seats) => get(seats, [y, x])

const firstVisibleSeatInDirection = (x, y, xDirection, yDirection, seats) => {
  const nextX = x + xDirection
  const nextY = y + yDirection
  const nextSeat = getSeat(nextX, nextY, seats)
  if (isNil(nextSeat)) {
    return null
  }
  if ([OCCUPIED_SEAT, EMPTY_SEAT].includes(nextSeat)) {
    return nextSeat
  }
  return firstVisibleSeatInDirection(nextX, nextY, xDirection, yDirection, seats)
}

const findVisibleSeats = (x, y, seats) => {
  return (
    [
      firstVisibleSeatInDirection(x, y, 1, 0, seats),
      firstVisibleSeatInDirection(x, y, 1, -1, seats),
      firstVisibleSeatInDirection(x, y, 0, -1, seats),
      firstVisibleSeatInDirection(x, y, -1, -1, seats),
      firstVisibleSeatInDirection(x, y, -1, 0, seats),
      firstVisibleSeatInDirection(x, y, -1, 1, seats),
      firstVisibleSeatInDirection(x, y, 0, 1, seats),
      firstVisibleSeatInDirection(x, y, 1, 1, seats),
    ] |> compact
  )
}

const newSeatValue = (currentSeatValue, visibleSeats) => {
  const countVisibleSeats = visibleSeats |> filter((s) => s === OCCUPIED_SEAT) |> size
  if (currentSeatValue === EMPTY_SEAT && countVisibleSeats === 0) {
    return OCCUPIED_SEAT
  }
  if (currentSeatValue === OCCUPIED_SEAT && countVisibleSeats >= 5) {
    return EMPTY_SEAT
  }
  return currentSeatValue
}

const runRound = (seats) => {
  return seats.map((column, y) => {
    return column.map((seat, x) => {
      return newSeatValue(seat, findVisibleSeats(x, y, seats))
    })
  })
}

const runRoundsUntilNoChange = (seats) => {
  const newSeats = runRound(seats)
  // printSeats(newSeats)
  if (isEqual(newSeats, seats)) {
    return newSeats
  }
  return runRoundsUntilNoChange(newSeats)
}

const countOccupied = (seats) => flatten(seats) |> filter((seat) => seat === OCCUPIED_SEAT) |> size
// input[y][x]
const input = parseInput('./data/day11.txt')

console.log(input)

const seats = runRoundsUntilNoChange(input)

console.log(countOccupied(seats))
