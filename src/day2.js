import fs from 'fs'
import { filter, map, size } from 'lodash/fp'

const isPasswordValid = (min, max, character, password) => {
  const occurencesOfLetter = password |> filter((c) => c === character) |> size
  return min <= occurencesOfLetter && occurencesOfLetter <= max
}

const inputs =
  fs.readFileSync('./data/day2.txt').toString().trim().split('\n')
  |> map((s) => s.split(' '))
  |> map(([range, characters, password]) => {
    const [min, max] = range.split('-')
    const character = characters.replace(':', '')
    return { min: parseInt(min, 10), max: parseInt(max, 10), character, password }
  })
const validPasswordCount = inputs |> filter((input) => isPasswordValid(input.min, input.max, input.character, input.password)) |> size
console.log(validPasswordCount)
