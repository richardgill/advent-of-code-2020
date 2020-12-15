import { dropRight, last, findLastIndex } from 'lodash'

const calculateSequence = (numbersSoFar, until) => {
  if (numbersSoFar.length === until) {
    return numbersSoFar
  }
  const number = last(numbersSoFar)
  const lastSeenIndex = findLastIndex(dropRight(numbersSoFar, 1), (n) => n === number)
  const notSeenBefore = lastSeenIndex === -1
  if (notSeenBefore) {
    return calculateSequence([...numbersSoFar, 0], until)
  }
  const age = numbersSoFar.length - lastSeenIndex - 1
  return calculateSequence([...numbersSoFar, age], until)
}

const testInput = (startingNumbers) => {
  const sequence = calculateSequence(startingNumbers, 2020)
  console.log('sequence', sequence)
  console.log('answer', last(sequence))
  console.log('\n')
}

testInput([0, 3, 6])
testInput([1, 3, 2])
testInput([1, 2, 3])
testInput([2, 3, 1])
testInput([3, 2, 1])
testInput([3, 1, 2])
testInput([5, 1, 9, 18, 13, 8, 0])
