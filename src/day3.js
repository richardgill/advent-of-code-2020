import fs from 'fs'
import { filter, map, size, times } from 'lodash/fp'

const inputs = fs.readFileSync('./data/day3.txt').toString().trim().split('\n') |> map((s) => s.split(''))

const height = size(inputs)
const width = size(inputs[0])

const down = 1
const right = 3

const coordinates = height |> times((row) => ({ x: (row * right) % width, y: row * down }))

const hits = coordinates |> filter(({ x, y }) => inputs[y][x] !== '.') |> size

console.log(hits)
