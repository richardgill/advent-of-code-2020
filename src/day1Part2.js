import fs from 'fs'
import _ from 'lodash'
import { map, find, sum } from 'lodash/fp'

const getPairCombosHelper = ([first, second, ...tail]) => {
  if (!_.isFinite(first) || !_.isFinite(second)) {
    return []
  }
  return [...(tail || []).map((x) => [first, second, x]), ...getPairCombosHelper([first, ...tail])]
}
const getPairCombos = ([first, ...tail]) => {
  if (!_.isFinite(first)) {
    return []
  }
  return [...getPairCombosHelper([first, ...tail]), ...getPairCombos(tail)]
}

const input = fs.readFileSync('./data/day1.txt').toString().split('\n') |> map(parseInt)
const result = getPairCombos(input) |> find((x) => sum(x) === 2020)
console.log(result[0] * result[1] * result[2])
