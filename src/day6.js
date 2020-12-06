import fs from 'fs'
import { map, flatMap, uniq, size, sum } from 'lodash/fp'

const answers = fs.readFileSync('./data/day6.txt').toString().trim().split('\n\n') |> map((group) => group.split('\n'))

const result =
  answers
  |> map((groupAnswers) => {
    return groupAnswers |> flatMap((x) => x.split('')) |> uniq
  })
  |> map(size)
  |> sum

console.log(result)
