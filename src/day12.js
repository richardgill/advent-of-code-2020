import fs from 'fs'
import { indexOf } from 'lodash'

const manhattenDistance = (x, y) => Math.abs(x) + Math.abs(y)

const parseInstruction = (instructionString) => ({
  instruction: instructionString[0],
  magnitude: parseInt(instructionString.substring(1), 10),
})

const parseInput = (file) => fs.readFileSync(file).toString().trim().split('\n').map(parseInstruction)

const ORIENTATIONS = ['N', 'E', 'S', 'W']

const rotate = (instruction, orientation) => {
  const orientations = instruction.instruction === 'R' ? ORIENTATIONS : ORIENTATIONS.slice().reverse()
  const indexOfOrientation = indexOf(orientations, orientation)
  const numberOfTurns = instruction.magnitude / 90

  console.log(instruction, orientation)
  console.log('indexOfOrientation', indexOfOrientation)
  console.log(numberOfTurns)
  console.log(orientations)
  const newOrientationIndex = (indexOfOrientation + numberOfTurns) % orientations.length
  console.log(orientations[newOrientationIndex])
  console.log('\n')
  return orientations[newOrientationIndex]
}

const followInstruction = (instruction, position, orientation) => {
  if (instruction.instruction === 'N') {
    return { position: { x: position.x, y: position.y + instruction.magnitude }, orientation }
  }
  if (instruction.instruction === 'S') {
    return { position: { x: position.x, y: position.y - instruction.magnitude }, orientation }
  }
  if (instruction.instruction === 'E') {
    return { position: { x: position.x + instruction.magnitude, y: position.y }, orientation }
  }
  if (instruction.instruction === 'W') {
    return { position: { x: position.x - instruction.magnitude, y: position.y }, orientation }
  }
  if (instruction.instruction === 'L') {
    return { position, orientation: rotate(instruction, orientation) }
  }
  if (instruction.instruction === 'R') {
    return { position, orientation: rotate(instruction, orientation) }
  }
  if (instruction.instruction === 'F') {
    return followInstruction({ instruction: orientation, magnitude: instruction.magnitude }, position, orientation)
  }
  throw new Error(`Unknown instruction: ${instruction}`)
}

const followInstructions = ([nextInstruction, ...rest], currentPosition = { x: 0, y: 0 }, currentOrientation = 'E') => {
  if (!nextInstruction) {
    return currentPosition
  }
  const { position, orientation } = followInstruction(nextInstruction, currentPosition, currentOrientation)
  return followInstructions(rest, position, orientation)
}

// const input = parseInput('./data/day12Example.txt')
const input = parseInput('./data/day12.txt')
// const input = [
//   { instruction: 'L', magnitude: 180 },
//   { instruction: 'R', magnitude: 180 },
//   { instruction: 'L', magnitude: 90 },
//   { instruction: 'R', magnitude: 90 },
//   { instruction: 'R', magnitude: 270 },
//   // { instruction: 'R', magnitude: 270 },
// ]
const position = followInstructions(input)
const answer = manhattenDistance(position.x, position.y)
console.log('position', position)
console.log('answer', answer)
