import fs from 'fs'
import { intersection } from 'lodash' // ??? FFS
import { map, size, sum } from 'lodash/fp'

const answers = fs.readFileSync('./data/day6.txt').toString().trim().split('\n\n') |> map((group) => group.split('\n'))

const result =
  answers
  |> map((groupAnswers) => {
    return groupAnswers.map((x) => x.split(''))
  })
  |> map((as) => intersection(...as))
  |> map(size)
  |> sum

console.log(result)
