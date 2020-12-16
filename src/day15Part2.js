import { last, isNil } from 'lodash'

const calculateNumber = (numbersSoFar, until) => {
  if (numbersSoFar.length === until) {
    return numbersSoFar
  }
  const lastSeen = new Array(1000000000)
  numbersSoFar.forEach((number, index) => {
    lastSeen[number] = index
  })
  let number = last(numbersSoFar)
  let lastNumber
  for (let index = numbersSoFar.length; index < until; index++) {
    const lastSeenIndex = lastSeen[number]
    const notSeenBefore = isNil(lastSeenIndex)

    const numberToAdd = notSeenBefore ? 0 : index - lastSeenIndex - 1
    lastNumber = number
    number = numberToAdd
    lastSeen[lastNumber] = index - 1
  }
  return number
}

const testInput = (startingNumbers) => {
  const answer = calculateNumber(startingNumbers, 30000000)
  console.log('answer', answer)
  console.log('\n')
}
// testInput([0, 3, 6])
// testInput([1, 3, 2])
// testInput([1, 2, 3])
// testInput([2, 3, 1])
// testInput([3, 2, 1])
// testInput([3, 1, 2])
testInput([5, 1, 9, 18, 13, 8, 0])
