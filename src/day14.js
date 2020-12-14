import fs from 'fs'
import { dropRight, last, isEmpty, values, sum } from 'lodash'

const parseInstruction = (instructionString) => {
  if (instructionString.includes('mask')) {
    return { type: 'mask', value: instructionString.replace('mask = ', '') }
  }
  const memoryAddress = parseInt(instructionString.match(/mem\[(\d+)]/)[1], 10)
  return {
    type: 'memoryAssign',
    address: memoryAddress,
    value: BigInt(parseInt(last(instructionString.split(' = ')).trim(), 10)),
  }
}

const parseInput = (file) => {
  const instructions = fs.readFileSync(file).toString().trim().split('\n')
  return instructions.map(parseInstruction)
}

const binaryToNumber = (binaryNumberString, power = 0) => {
  // console.log(binaryNumberString)
  if (isEmpty(binaryNumberString)) {
    return 0n
  }
  const lastDigit = last(binaryNumberString)
  // console.log(lastDigit)
  const value = lastDigit === '0' ? 0n : 2n ** BigInt(power)

  return value + binaryToNumber(dropRight(binaryNumberString, 1), power + 1)
}

const applyMask = (number, mask) => {
  const andMask = mask.replaceAll('X', '1')
  const orMask = mask.replaceAll('X', '0')
  console.log('andMask', andMask)
  console.log('orMask', orMask)
  console.log('and as int', binaryToNumber(andMask))
  console.log('or as int', binaryToNumber(orMask))
  return (number | binaryToNumber(orMask)) & binaryToNumber(andMask)
}

const testInput = (instructions) => {
  var mask = null
  const memory = {}
  for (const instruction of instructions) {
    if (instruction.type === 'mask') {
      mask = instruction.value
    } else {
      const value = applyMask(instruction.value, mask)
      console.log('input', instruction.value)
      console.log('mask', mask)
      console.log('value', value)
      memory[instruction.address] = value
    }
  }
  console.log('memory', memory)
  const answer = values(memory) |> sum
  console.log('answer', answer)
}

// testInput(parseInput('./data/day14Example.txt'))
// testInput(parseInput('./data/day14.txt'))

// console.log(11 & 1)

// console.log(binaryToNumber('0001'))
// console.log(binaryToNumber('0010'))
// console.log(binaryToNumber('0110'))
// console.log(binaryToNumber('0111'))
console.log(binaryToNumber('111111111111111111111111111111111111'))

// console.log(applyMask(11, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'))
// console.log(applyMask(101, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'))
// console.log(applyMask(0, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'))

// testInput(parseInput('./data/day14Example.txt'))
// testInput(parseInput('./data/day14.txt'))
testInput(parseInput('./data/day14Example2.txt'))
