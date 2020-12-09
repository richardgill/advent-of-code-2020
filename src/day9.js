import fs from 'fs'
import { map, sum, flatMap, find } from 'lodash/fp'
import { isFinite, take, drop, range, min, max } from 'lodash'

const getPairCombosHelper = ([first, second, ...tail]) => {
  if (!isFinite(first) || !isFinite(second)) {
    return []
  }
  return [[first, second], ...getPairCombosHelper([first, ...tail])]
}
const getPairCombos = ([first, ...tail]) => {
  if (!isFinite(first)) {
    return []
  }
  return [...getPairCombosHelper([first, ...tail]), ...getPairCombos(tail)]
}

const findInvalidNumber = (numbers, preambleLength) => {
  const numberToCheck = numbers[preambleLength]
  if (!isFinite(numberToCheck)) {
    throw new Error('Ran out of numbers to check :(')
  }
  const preamble = take(numbers, preambleLength)
  const sums = getPairCombos(preamble) |> map(sum)
  if (!sums.includes(numberToCheck)) {
    return numberToCheck
  }
  return findInvalidNumber(drop(numbers, 1), preambleLength)
}

const findContiguousSum = (numbers, target) => {
  return (
    range(2, numbers.length)
    |> flatMap((length) => {
      return range(0, numbers.length - length) |> map((startIndex) => take(drop(numbers, startIndex), length))
    })
    |> find((contiguous) => sum(contiguous) === target)
  )
}

const input = fs.readFileSync('./data/day9.txt').toString().trim().split('\n') |> map((x) => parseInt(x, 10))

console.log('numbers', input)

const invalidNumber = findInvalidNumber(input, 25)
console.log('invalidNumber', invalidNumber)
const answer = findContiguousSum(input, invalidNumber)
console.log('answer', answer)
console.log('sum', min(answer) + max(answer))
