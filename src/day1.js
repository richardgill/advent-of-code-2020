import fs from 'fs'
import _ from 'lodash'
import { map, find, sum } from 'lodash/fp'

const getPairCombosHelper = ([first, second, ...tail]) => {
  if (!_.isNumber(first) || !_.isNumber(second)) {
    return []
  }
  return [[first, second], ...getPairCombosHelper([first, ...tail])]
}
const getPairCombos = ([first, ...tail]) => {
  if (!_.isNumber(first)) {
    return []
  }
  return [...getPairCombosHelper([first, ...tail]), ...getPairCombos(tail)]
}

const input = fs.readFileSync('./data/day1.txt').toString().split('\n') |> map(parseInt)

const result = getPairCombos(input) |> find((x) => sum(x) === 2020)

console.log(result[0] * result[1])
