import fs from 'fs'
import { map, filter } from 'lodash/fp'
import { range, sortBy, size } from 'lodash'

const input = fs.readFileSync('./data/day10.txt').toString().trim().split('\n') |> map((x) => parseInt(x, 10))

const sortedAdapters = input |> sortBy
const differences = range(0, sortedAdapters.length - 1) |> map((i) => sortedAdapters[i + 1] - sortedAdapters[i])

const oneCount = differences |> filter((d) => d === 1) |> size
const threeCount = differences |> filter((d) => d === 3) |> size

const answer = (oneCount + 1) * (threeCount + 1)

console.log('answer', answer)
