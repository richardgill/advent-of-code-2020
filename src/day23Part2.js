import linkedList from 'yallist'
import { times, range, max, indexOf } from 'lodash'

const nodesToArrayByValue = (node) => {
  const array = new Array(10000000)
  while (node) {
    array[node.value] = node
    node = node.next
  }
  return array
}

const linkNodes = (node1, node2) => {
  if (node1) {
    node1.next = node2
  }
  if (node2) {
    node2.prev = node1
  }
}

const lastNode = (node) => {
  while (node.next) {
    node = node.next
  }
  return node
}

const nthNode = (node, n) => {
  if (n === 0) {
    return node
  }
  return nthNode(node.next, n - 1)
}

const nodeToArray = (node) => {
  const array = []
  while (node) {
    array.push(node.value)
    node = node.next
  }
  return array
}

const pickupCups = (cups, numberToPickup) => {
  const nodeAfterPickup = nthNode(cups, numberToPickup + 1)
  const pickedUpCupsNode = cups.next
  const lastPickedUpCupsNode = nthNode(cups, numberToPickup)
  lastPickedUpCupsNode.next = null
  linkNodes(cups, nodeAfterPickup)
  return pickedUpCupsNode
}

const findDestinationCup = (cups, pickedUpCupNode, maxCup) => {
  const currentCup = cups.value
  const pickedUpCups = nodeToArray(pickedUpCupNode)
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
}

const playCupsRound = (cups, lastCupsNode, valueToNode, maxCup) => {
  const pickedUpCupsNode = pickupCups(cups, 3)

  const destinationCup = findDestinationCup(cups, pickedUpCupsNode, maxCup)
  const destinationNode = valueToNode[destinationCup]
  const oldAfterDest = destinationNode.next

  linkNodes(destinationNode, pickedUpCupsNode)

  const lastPickedUpCup = lastNode(pickedUpCupsNode)
  linkNodes(lastPickedUpCup, oldAfterDest)

  const oldHead = cups
  cups = cups.next
  oldHead.next = null
  // last node is either the previous last node, or the last pickedUp node.
  const currentLastNode = !lastPickedUpCup.next ? lastPickedUpCup : lastCupsNode
  linkNodes(currentLastNode, oldHead)

  return [cups, oldHead]
}

const playCups = (cups, moves) => {
  const maxCup = max(cups)
  const cupsLinkedList = linkedList.create(cups)
  let cupsHeadNode = cupsLinkedList.head
  let cupsTailNode = cupsLinkedList.tail
  const valueToNode = nodesToArrayByValue(cupsHeadNode)
  // eslint-disable-next-line no-unused-vars
  for (const index of times(moves)) {
    const result = playCupsRound(cupsHeadNode, cupsTailNode, valueToNode, maxCup)
    // eslint-disable-next-line prefer-destructuring
    cupsHeadNode = result[0]
    // eslint-disable-next-line prefer-destructuring
    cupsTailNode = result[1]
  }

  return nodeToArray(cupsHeadNode)
}

const twoCupsAfter = (cups, number) => {
  const indexOfNumber = indexOf(cups, number)
  console.log('indexOf1', indexOfNumber)
  return [cups[indexOfNumber + 1], cups[indexOfNumber + 2]]
}

// const cupsAfter = (cups, number) => {
//   const indexOfNumber = indexOf(cups, number)
//   return [...cups.slice(indexOfNumber + 1), ...cups.slice(0, indexOfNumber)]
// }

const run = (inputString, moves, cupsUpTo = 1000000) => {
  const cups = inputString.split('').map((number) => parseInt(number, 10))
  console.log(cups)
  const manyCups = [...cups, ...range(max(cups) + 1, cupsUpTo + 1)]
  console.log('manyCups', manyCups)
  const endCups = playCups(manyCups, moves)

  const twoCups = twoCupsAfter(endCups, 1)
  console.log('endCups', endCups)
  console.log('answer', twoCups[0] * twoCups[1])
  // const part1Answer = cupsAfter(endCups, 1).join('')
  // console.log('part1Answer', part1Answer)
  console.log('\n')
}

if (process.env.NODE_ENV !== 'test') {
  // const example1 = `389125467`
  const puzzleInput = `418976235`
  // run(example1, 100, 10)

  // run(example1, 10, 10)
  // run(puzzleInput, 100, 10)
  // run(puzzleInput, 100, 20)
  // run(example1, 10000000)
  run(puzzleInput, 10000000)
}
