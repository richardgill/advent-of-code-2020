import { last, isNil, fromPairs } from 'lodash'

const calculateSequence = (numbersSoFar, until) => {
  if (numbersSoFar.length === until) {
    return numbersSoFar
  }

  const lastSeen = numbersSoFar.map((number, index) => [number, index]) |> fromPairs
  for (let index = numbersSoFar.length; index < until; index++) {
    if (index % 100000 === 0) {
      console.log(`${(index / until) * 100}%`)
    }
    const number = last(numbersSoFar)
    const lastSeenIndex = lastSeen[number]
    const notSeenBefore = isNil(lastSeenIndex)
    const numberToAdd = notSeenBefore ? 0 : numbersSoFar.length - lastSeenIndex - 1
    numbersSoFar.push(numberToAdd)
    // this is: lastSeen[numberToAdd] = index but for the previous element, so there is a lag by 1
    lastSeen[numbersSoFar[index - 1]] = index - 1
  }
  return numbersSoFar
}

const testInput = (startingNumbers) => {
  const sequence = calculateSequence(startingNumbers, 2020)
  console.log('sequence', sequence)
  console.log('answer', last(sequence))
  console.log('\n')
}
// testInput([0, 3, 6])
// testInput([1, 3, 2])
// testInput([1, 2, 3])
// testInput([2, 3, 1])
// testInput([3, 2, 1])
// testInput([3, 1, 2])
testInput([5, 1, 9, 18, 13, 8, 0])
