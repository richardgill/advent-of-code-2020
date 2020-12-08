import fs from 'fs'
import { compact } from 'lodash'
import { map, find } from 'lodash/fp'

const parseInstruction = (instructionText) => {
  const [operator, argumentText] = instructionText.split(' ')
  return { operator, argument: parseInt(argumentText, 10) }
}

const runInstruction = (instruction, index, accumulator) => {
  if (instruction.operator === 'nop') {
    return { newIndex: index + 1, newAccumulator: accumulator }
  }
  if (instruction.operator === 'acc') {
    return { newIndex: index + 1, newAccumulator: accumulator + instruction.argument }
  }
  if (instruction.operator === 'jmp') {
    return { newIndex: index + instruction.argument, newAccumulator: accumulator }
  }
  throw new Error(`unknown operator: ${instruction.operator}`)
}

const runInstructions = (instructions, index = 0, accumulator = 0, previousIndexes = []) => {
  if (previousIndexes.includes(index)) {
    return { looped: true, accumulator }
  }
  if (instructions.length === index) {
    return { looped: false, accumulator }
  }
  const instruction = instructions[index]
  const { newIndex, newAccumulator } = runInstruction(instruction, index, accumulator)
  return runInstructions(instructions, newIndex, newAccumulator, [...previousIndexes, index])
}

const instructions = fs.readFileSync('./data/day8.txt').toString().trim().split('\n') |> map(parseInstruction)

const allPossibleInstructions =
  instructions.map((instructionToModify, indexToModify) => {
    if (instructionToModify.operator === 'acc') {
      return null
    }
    return instructions.map((instruction, index) => {
      if (index !== indexToModify) {
        return instruction
      }
      return { ...instructionToModify, operator: instructionToModify.operator === 'nop' ? 'jmp' : 'nop' }
    })
  }) |> compact

const answer =
  allPossibleInstructions |> map((instructionSet) => runInstructions(instructionSet)) |> find((result) => !result.looped)

console.log('answer', answer)
