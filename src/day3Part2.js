import fs from 'fs'
import { filter, map, size, times, ceil } from 'lodash/fp'

const inputs = fs.readFileSync('./data/day3.txt').toString().trim().split('\n') |> map((s) => s.split(''))

const calculateHits = (slope, right, down) => {
  const slopeHeight = size(slope)
  const stepsDown = ceil(slopeHeight / down)
  const slopeWidth = size(slope[0])
  const coordinates = stepsDown |> times((row) => ({ x: (row * right) % slopeWidth, y: row * down }))
  return coordinates |> filter(({ x, y }) => slope[y][x] !== '.') |> size
}

const answer =
  calculateHits(inputs, 1, 1) *
  calculateHits(inputs, 3, 1) *
  calculateHits(inputs, 5, 1) *
  calculateHits(inputs, 7, 1) *
  calculateHits(inputs, 1, 2)

console.log(answer)
