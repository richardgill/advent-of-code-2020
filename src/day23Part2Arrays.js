import { times, range, take, drop, max, isFinite, indexOf } from 'lodash'

const pickupCups = (cups, numberToPickup) => {
  return cups.splice(1, numberToPickup)
}

const findDestinationCup = (cups, pickedUpCups, maxCup) => {
  const currentCup = cups[0]
  let destinationCup = currentCup - 1
  while (true) {
    if (destinationCup <= 0) {
      destinationCup = maxCup
    } else if (!pickedUpCups.includes(destinationCup)) {
      return destinationCup
    } else {
      destinationCup--
    }
  }

  // const largestButSmaller = cups.filter((c) => c < currentCup) |> max
  // return isFinite(largestButSmaller) ? largestButSmaller : maxCup
}

const playCupsRound = (cups, maxCup) => {
  // console.log('\n\ncups', cups)
  const currentCup = cups[0]
  const pickedUpCups = pickupCups(cups, 3)
  // console.log('pickedUpCups', pickedUpCups)
  // console.log('otherCups', otherCups)
  const destinationCup = findDestinationCup(cups, pickedUpCups, maxCup)
  // console.log('destinationCup', destinationCup)
  const destinationIndex = indexOf(cups, destinationCup)
  // console.log('cups', cups)
  // console.log('destinationIndex', destinationIndex)
  cups.splice(destinationIndex + 1, 0, ...pickedUpCups)
  // console.log('dest splice', cups)
  // remove first cup
  cups.splice(0, 1)

  // add it back on end
  cups.push(currentCup)

  // console.info('\n')
}

const playCups = (cups, moves) => {
  const maxCup = max(cups)
  for (const index of times(moves)) {
    if (index > 6) {
      // throw new Error('Stop!')
    }
    if (index % 1000 === 0) {
      console.log(`Round: ${index}`)
    }
    playCupsRound(cups, maxCup)
  }

  return cups
}

const twoCupsAfter = (cups, number) => {
  const indexOfNumber = indexOf(cups, number)
  return [cups[(indexOfNumber + 1) % cups.length], cups[(indexOfNumber + 2) % cups.length]]
}

const cupsAfter = (cups, number) => {
  const indexOfNumber = indexOf(cups, number)
  return [...cups.slice(indexOfNumber + 1), ...cups.slice(0, indexOfNumber)]
}

const run = (inputString, moves, cupsUpTo = 1000000) => {
  const cups = inputString.split('').map((number) => parseInt(number, 10))
  console.log(cups)
  const manyCups = [...cups, ...range(max(cups) + 1, cupsUpTo)]
  console.log('manyCups', manyCups)
  const endCups = playCups(manyCups, moves)

  const answer = twoCupsAfter(endCups, 1)[0] * twoCupsAfter(endCups, 1)[1]
  console.log('endCups', endCups)
  console.log('answer', answer)
  const part1Answer = cupsAfter(endCups, 1).join('')
  console.log('part1Answer', part1Answer)
  console.log('\n')
}

if (process.env.NODE_ENV !== 'test') {
  const example1 = `389125467`
  const puzzleInput = `418976235`
  // run(example1, 100, 10)

  run(example1, 10, 10)
  run(puzzleInput, 100, 10)
  // run(example1, 10, 20)
  run(puzzleInput, 10000000)
}
