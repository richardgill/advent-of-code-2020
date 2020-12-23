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
const nthNodeInList = (list, n) => {
  return nthNode(list.head, n)
}

const nodeToArray = (node) => {
  const array = []
  while (node) {
    // console.log('find node: ', node)
    array.push(node.value)
    node = node.next
  }
  return array
}

const findNodeWithValue = (node, value) => {
  while (node && node.value !== value) {
    // console.log('find node: ', node)
    node = node.next
  }
  return node
}

const pickupCups = (cups, numberToPickup) => {
  const nodeAfterPickup = nthNode(cups, numberToPickup + 1)
  // console.log('nodeAfterPickup', nodeAfterPickup)
  const pickedUpCupsNode = cups.next
  const lastPickedUpCupsNode = nthNode(cups, numberToPickup)
  lastPickedUpCupsNode.next = null
  // prev = null missing?
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

  // const largestButSmaller = cups.filter((c) => c < currentCup) |> max
  // return isFinite(largestButSmaller) ? largestButSmaller : maxCup
}

const playCupsRound = (cups, lastCupsNode, valueToNode, maxCup) => {
  // console.log('\n\ncups', nodeToArray(cups))
  // const currentCup = cups.head
  // console.log(currentCup)
  let start = process.hrtime()
  const pickedUpCupsNode = pickupCups(cups, 3)
  let end = process.hrtime(start)
  // console.info('pickup: Execution time (hr): %ds %dms', end[0], end[1] / 1000000)
  // console.log('pickedUpCups', nodeToArray(pickedUpCupsNode))
  // console.log('otherCups', nodeToArray(cups))
  // throw new Error('stop')
  start = process.hrtime()
  const destinationCup = findDestinationCup(cups, pickedUpCupsNode, maxCup)
  end = process.hrtime(start)
  // console.info('findDestinationCup: Execution time (hr): %ds %dms', end[0], end[1] / 1000000)
  // console.log('destinationCup', destinationCup)
  start = process.hrtime()
  const destinationNode = valueToNode[destinationCup]
  end = process.hrtime(start)
  // console.info('find dest node WithValue: Execution time (hr): %ds %dms', end[0], end[1] / 1000000)
  // console.log('cups', cups)
  // console.log('destinationValue', destinationNode?.value)
  // console.log('otherCups', nodeToArray(cups))
  start = process.hrtime()
  const oldAfterDest = destinationNode.next
  // console.log('oldAfterDest', oldAfterDest?.value)
  // console.log('destinationNode', destinationNode)
  // console.log('\npickedUpCupsNode', pickedUpCupsNode)

  linkNodes(destinationNode, pickedUpCupsNode)
  end = process.hrtime(start)
  // console.info('dest node relink: Execution time (hr): %ds %dms', end[0], end[1] / 1000000)
  // destinationNode.next = pickedUpCupsNode
  // console.log('otherCups', nodeToArray(cups))

  start = process.hrtime()
  const lastPickedUpCup = lastNode(pickedUpCupsNode)
  linkNodes(lastPickedUpCup, oldAfterDest)
  end = process.hrtime(start)
  // console.info('lastPickedUpCup node relink: Execution time (hr): %ds %dms', end[0], end[1] / 1000000)
  // console.log('otherCups', nodeToArray(cups))
  // lastPickedUpCup.next = oldAfterDest

  // const currentCupNode = cups.head
  // cups.head = currentCupNode.next
  start = process.hrtime()
  const oldHead = cups
  cups = cups.next
  oldHead.next = null
  const currentLastNode = !lastPickedUpCup.next ? lastPickedUpCup : lastCupsNode
  linkNodes(currentLastNode, oldHead)

  end = process.hrtime(start)
  // console.info('lats node node relink: Execution time (hr): %ds %dms', end[0], end[1] / 1000000)

  // cups.pushNode(cups.head)
  // console.log('result cups', nodeToArray(cups))

  // console.info('\n')
  return [cups, oldHead]
}

const playCups = (cups, moves) => {
  const maxCup = max(cups)
  const cupsLinkedList = linkedList.create(cups)
  let cupsHeadNode = cupsLinkedList.head
  let cupsTailNode = cupsLinkedList.tail
  console.log('got here')
  const valueToNode = nodesToArrayByValue(cupsHeadNode)
  // console.log('valueToNode', valueToNode)
  for (const index of times(moves)) {
    if (index > 0) {
      // throw new Error('Stop!')
    }
    if (index % 1000 === 0) {
      console.log(`Round: ${index}`)
    }
    const result = playCupsRound(cupsHeadNode, cupsTailNode, valueToNode, maxCup)
    cupsHeadNode = result[0]
    cupsTailNode = result[1]
  }

  return nodeToArray(cupsHeadNode)
}

const twoCupsAfter = (cups, number) => {
  const indexOfNumber = indexOf(cups, number)
  console.log('indexOf1', indexOfNumber)
  return [cups[indexOfNumber + 1], cups[indexOfNumber + 2]]
}

const cupsAfter = (cups, number) => {
  const indexOfNumber = indexOf(cups, number)
  return [...cups.slice(indexOfNumber + 1), ...cups.slice(0, indexOfNumber)]
}

const run = (inputString, moves, cupsUpTo = 1000000) => {
  const cups = inputString.split('').map((number) => parseInt(number, 10))
  console.log(cups)
  const manyCups = [...cups, ...range(max(cups) + 1, cupsUpTo + 1)]
  console.log('manyCups', manyCups)
  const endCups = playCups(manyCups, moves)

  const answer = twoCupsAfter(endCups, 1)
  console.log('endCups', endCups)
  console.log('answer', answer)
  const part1Answer = cupsAfter(endCups, 1).join('')
  // console.log('part1Answer', part1Answer)
  console.log('\n')
}

if (process.env.NODE_ENV !== 'test') {
  const example1 = `389125467`
  const puzzleInput = `418976235`
  // run(example1, 100, 10)

  run(example1, 10, 10)
  run(puzzleInput, 100, 10)
  run(puzzleInput, 100, 20)
  // run(example1, 10000000)
  run(puzzleInput, 10000000)
}
