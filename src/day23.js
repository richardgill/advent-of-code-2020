import { times, take, drop, max, isFinite, indexOf } from 'lodash'

const pickupCups = (cups, numberToPickup) => {
  return [[...take(cups, 1), ...drop(cups, numberToPickup + 1)], take(drop(cups, 1), numberToPickup)]
}

const findDestinationCup = (cups) => {
  const currentCup = cups[0]
  const largestButSmaller = cups.filter((c) => c < currentCup) |> max
  return isFinite(largestButSmaller) ? largestButSmaller : max(cups)
}

const playCupsRound = (cups) => {
  console.log('\n\ncups', cups)
  const currentCup = cups[0]
  const [otherCups, pickedUpCups] = pickupCups(cups, 3)
  console.log('pickedUpCups', pickedUpCups)
  console.log('otherCups', otherCups)
  const destinationCup = findDestinationCup(otherCups)
  console.log('destinationCup', destinationCup)
  const destinationIndex = indexOf(otherCups, destinationCup)
  console.log('destinationIndex', destinationIndex)
  const newCups = [
    ...take(drop(otherCups, 1), destinationIndex),
    ...pickedUpCups,
    ...drop(otherCups, destinationIndex + 1),
    currentCup,
  ]
  return newCups
}

const playCups = (numbers, moves) => {
  return times(moves).reduce((cups) => {
    return playCupsRound(cups)
  }, numbers)
}

const cupsAfter = (cups, number) => {
  const indexOfNumber = indexOf(cups, number)
  return [...cups.slice(indexOfNumber + 1), ...cups.slice(0, indexOfNumber)]
}

const run = (inputString, moves) => {
  const cups = inputString.split('').map((number) => parseInt(number, 10))
  console.log(cups)
  const endCups = playCups(cups, moves)
  const answer = cupsAfter(endCups, 1).join('')
  console.log('endCups', endCups)
  console.log('answer', answer)
  console.log('\n')
}

if (process.env.NODE_ENV !== 'test') {
  const example1 = `389125467`
  const puzzleInput = `418976235`
  run(example1, 10)
  run(example1, 100)
  run(puzzleInput, 100)
}
