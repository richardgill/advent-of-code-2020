import fs from 'fs'
import { filter } from 'lodash/fp'
import { compact, get, size, flatten, isEqual } from 'lodash'

const EMPTY_SEAT = 'L'
const OCCUPIED_SEAT = '#'

const parseInput = (file) =>
  fs
    .readFileSync(file)
    .toString()
    .trim()
    .split('\n')
    .map((row) => row.split(''))

const printSeats = (seats) => {
  seats.forEach((col) => {
    col.forEach((seat) => {
      process.stdout.write(`${seat} `)
    })
    console.log('\n')
  })
  console.log('\n')
}

// null safe
const getSeat = (x, y, seats) => get(seats, [y, x])

const findAdjacentSeats = (x, y, seats) => {
  return (
    [
      getSeat(x + 1, y, seats),
      getSeat(x + 1, y - 1, seats),
      getSeat(x, y - 1, seats),
      getSeat(x - 1, y - 1, seats),
      getSeat(x - 1, y, seats),
      getSeat(x - 1, y + 1, seats),
      getSeat(x, y + 1, seats),
      getSeat(x + 1, y + 1, seats),
    ] |> compact
  )
}

const newSeatValue = (currentSeatValue, adjacentSeats) => {
  const countAdajacentSeatsOccupied = adjacentSeats |> filter((s) => s === OCCUPIED_SEAT) |> size
  if (currentSeatValue === EMPTY_SEAT && countAdajacentSeatsOccupied === 0) {
    return OCCUPIED_SEAT
  }
  if (currentSeatValue === OCCUPIED_SEAT && countAdajacentSeatsOccupied >= 4) {
    return EMPTY_SEAT
  }
  return currentSeatValue
}

const runRound = (seats) => {
  return seats.map((column, y) => {
    return column.map((seat, x) => {
      return newSeatValue(seat, findAdjacentSeats(x, y, seats))
    })
  })
}

const runRoundsUntilNoChange = (seats) => {
  const newSeats = runRound(seats)
  printSeats(newSeats)
  if (isEqual(newSeats, seats)) {
    return newSeats
  }
  return runRoundsUntilNoChange(newSeats)
}

const countOccupied = (seats) => flatten(seats) |> filter((seat) => seat === OCCUPIED_SEAT) |> size
// input[y][x]
const input = parseInput('./data/day11.txt')

console.log(input)
// printSeats(input)
const seats = runRoundsUntilNoChange(input)

console.log(countOccupied(seats))
