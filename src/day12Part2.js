import fs from 'fs'

const manhattenDistance = (x, y) => Math.abs(x) + Math.abs(y)

const parseInstruction = (instructionString) => ({
  instruction: instructionString[0],
  magnitude: parseInt(instructionString.substring(1), 10),
})

const parseInput = (file) => fs.readFileSync(file).toString().trim().split('\n').map(parseInstruction)

export const rotate = (instruction, wayPointPosition) => {
  if (instruction.magnitude === 0) {
    return wayPointPosition
  }
  return rotate(
    { instruction: instruction.instruction, magnitude: instruction.magnitude - 90 },
    instruction.instruction === 'R'
      ? { x: wayPointPosition.y, y: wayPointPosition.x * -1 }
      : { x: wayPointPosition.y * -1, y: wayPointPosition.x },
  )
}

export const moveToWayPoint = (instruction, wayPointPosition, shipPosition) => {
  return {
    x: shipPosition.x + wayPointPosition.x * instruction.magnitude,
    y: shipPosition.y + wayPointPosition.y * instruction.magnitude,
  }
}

const followInstruction = (instruction, wayPointPosition, shipPosition) => {
  if (instruction.instruction === 'N') {
    return { wayPointPosition: { x: wayPointPosition.x, y: wayPointPosition.y + instruction.magnitude }, shipPosition }
  }
  if (instruction.instruction === 'S') {
    return { wayPointPosition: { x: wayPointPosition.x, y: wayPointPosition.y - instruction.magnitude }, shipPosition }
  }
  if (instruction.instruction === 'E') {
    return { wayPointPosition: { x: wayPointPosition.x + instruction.magnitude, y: wayPointPosition.y }, shipPosition }
  }
  if (instruction.instruction === 'W') {
    return { wayPointPosition: { x: wayPointPosition.x - instruction.magnitude, y: wayPointPosition.y }, shipPosition }
  }
  if (['L', 'R'].includes(instruction.instruction)) {
    return { wayPointPosition: rotate(instruction, wayPointPosition), shipPosition }
  }
  if (instruction.instruction === 'F') {
    return { wayPointPosition, shipPosition: moveToWayPoint(instruction, wayPointPosition, shipPosition) }
  }
  throw new Error(`Unknown instruction: ${instruction}`)
}

export const followInstructions = (
  [nextInstruction, ...rest],
  currentWayPointPosition = { x: 10, y: 1 },
  currentShipPosition = { x: 0, y: 0 },
) => {
  if (!nextInstruction) {
    return currentShipPosition
  }
  const { wayPointPosition, shipPosition } = followInstruction(nextInstruction, currentWayPointPosition, currentShipPosition)
  return followInstructions(rest, wayPointPosition, shipPosition)
}

const testInput = (input) => {
  const position = followInstructions(input)
  const answer = manhattenDistance(position.x, position.y)
  console.log('position', position)
  console.log('answer', answer)
}

testInput(parseInput('./data/day12Example.txt'))
testInput(parseInput('./data/day12.txt'))
