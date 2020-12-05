import fs from 'fs'
import { filter, map, size, nth } from 'lodash/fp'

const isPasswordValid = (index1, index2, character, password) => {
  return ([password |> nth(index1), password |> nth(index2)] |> filter((c) => c === character) |> size) === 1
}

const inputs =
  fs.readFileSync('./data/day2.txt').toString().trim().split('\n')
  |> map((s) => s.split(' '))
  |> map(([range, characters, password]) => {
    const [min, max] = range.split('-')
    const character = characters.replace(':', '')
    return { index1: parseInt(min, 10) - 1, index2: parseInt(max, 10) - 1, character, password }
  })

const validPasswordCount =
  inputs |> filter((input) => isPasswordValid(input.index1, input.index2, input.character, input.password)) |> size

console.log(validPasswordCount)
