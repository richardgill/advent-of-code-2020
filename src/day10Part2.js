import fs from 'fs'
import { map, filter, reduce, drop as dropFp, dropRight as dropRightFp } from 'lodash/fp'
import {
  last,
  range,
  sortBy,
  max,
  isEmpty,
  drop,
  sum,
  dropRight,
  dropWhile,
  takeWhile,
  size,
  fromPairs,
  values,
  first,
} from 'lodash'

const countArrangementsSlow = ([adapter, ...rest]) => {
  if (isEmpty(rest)) {
    return 1
  }
  const inReach = rest |> filter((a) => a - adapter <= 3)
  // eslint-disable-next-line no-unused-vars
  return inReach.map((a, index) => countArrangementsSlow([a, ...drop(rest, index + 1)])) |> sum
}

const countArrangementsDP = (adapters) => {
  const canBeReachedFroms =
    adapters
    |> map((a1) => [a1, adapters |> filter((a) => a < a1 && a1 - a <= 3)])
    |> dropFp(1)
    |> dropRightFp(1)
    |> reduce(
      (resultsSoFar, [adapter, canBeReachedFrom]) => {
        const count = fromPairs(canBeReachedFrom |> map((x) => [x, resultsSoFar[x]]))
        return { ...resultsSoFar, ...count, [adapter]: sum(values(count)) }
      },
      { 0: 1 },
    )
  return canBeReachedFroms[last(dropRight(adapters, 1))]
}

const sumLastThreeSequence = (num, prev3 = [1, 0, 0]) => {
  if (num === 0) {
    return prev3[0]
  }
  return sumLastThreeSequence(num - 1, [sum(prev3), prev3[0], prev3[1]])
}

const groupOnes = (differences) => {
  if (isEmpty(differences)) {
    return []
  }
  const count = takeWhile(differences, (a) => a === 1) |> size
  if (count === 0) {
    return groupOnes(dropWhile(differences, (a) => a !== 1))
  }
  return [count, ...groupOnes(dropWhile(differences, (a) => a === 1))]
}

const product = (array) => {
  if (isEmpty(array)) {
    return 1
  }
  return first(array) * product(drop(array, 1))
}

const calculateDifferences = (adapters) => range(0, adapters.length - 1) |> map((i) => adapters[i + 1] - adapters[i])

const countArrangementsFast = (adapters) => {
  const groupedOnes = groupOnes(calculateDifferences(adapters))
  return groupedOnes |> map((x) => sumLastThreeSequence(x)) |> product
}

const test = (adapters) => {
  const sortedAdapters = [0, ...sortBy(adapters), max(adapters) + 3]
  console.log('sortedAdapters', sortedAdapters)
  const differences = calculateDifferences(sortedAdapters)
  console.log('fast', countArrangementsFast(sortedAdapters))
  console.log('fastDP', countArrangementsDP(sortedAdapters))
  console.log('differences', differences)
  console.log('\n')
}

const parseInput = (file) => fs.readFileSync(file).toString().trim().split('\n') |> map((x) => parseInt(x, 10))

test([1])
test([1, 2])
test([1, 2, 3])
test([1, 2, 3, 4])
test([1, 2, 3, 4, 5])
test([1, 2, 3, 4, 5, 6])
test([1, 2, 5, 6, 7])
test([3, 4])
test([1, 2, 3, 6])
test([1, 2, 3, 6, 7, 8])
test(parseInput('./data/day10EasyExample.txt'))
test(parseInput('./data/day10Example.txt'))
test(parseInput('./data/day10.txt'))
/*

  0(1),  1(1),  4(3),  5(2),  6(1),  7(1),
10(2), 11(1), 12(1), 15(2), 16(1), 19,
22
within reach
1, 1, 3, 2, 1,

3 4
(0), 3, 4, (7)
# 1

1 2
(0), 1, 2, (5)
(0), 2, (5)
#2

1 2 3
(0), 1, 2, 3, (6)
(0), 1, 2, (6)
(0), 1, 3, (6)
(0), 2, 3, (6)
(0), 2, (6)
(0), 3, (6)

1 2 3 4
(0), 1, 2, 3, 4, (7)
(0), 1, 2, 4, (7)
(0), 1, 3, 4, (7)
(0), 2, 3, 4, (7)
(0), 2, 4, (7)
(0), 3, 4, (7)

*/
