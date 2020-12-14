import fs from 'fs'
import { dropRight, last, isEmpty, values, sum, flatten } from 'lodash'

const parseInstruction = (instructionString) => {
  if (instructionString.includes('mask')) {
    return { type: 'mask', value: instructionString.replace('mask = ', '') }
  }
  const memoryAddress = parseInt(instructionString.match(/mem\[(\d+)]/)[1], 10)
  return {
    type: 'memoryAssign',
    address: BigInt(memoryAddress),
    value: BigInt(parseInt(last(instructionString.split(' = ')).trim(), 10)),
  }
}

const parseInput = (file) => {
  const instructions = fs.readFileSync(file).toString().trim().split('\n')
  return instructions.map(parseInstruction)
}

const binaryToNumber = (binaryNumberString, power = 0) => {
  if (isEmpty(binaryNumberString)) {
    return 0n
  }
  const lastDigit = last(binaryNumberString)
  const value = lastDigit === '0' ? 0n : 2n ** BigInt(power)
  return value + binaryToNumber(dropRight(binaryNumberString, 1), power + 1)
}

const applyMask = (number, mask) => {
  const andMask = mask.replaceAll('X', '1')
  const orMask = mask.replaceAll('X', '0')
  return (number | binaryToNumber(orMask)) & binaryToNumber(andMask)
}

// example 'X110X' returns ['1XXX1', '0XXX1', '1XXX0', '0XXX0']
const allMasks = ([firstDigit, ...restOfMask]) => {
  if (!firstDigit) {
    return []
  }
  const masks = allMasks(restOfMask)
  if (['0', '1'].includes(firstDigit)) {
    if (isEmpty(masks)) {
      return ['X']
    }
    return masks.map((m) => `X${m}`)
  }
  if (isEmpty(masks)) {
    return ['0', '1']
  }
  return flatten([masks.map((m) => `0${m}`), masks.map((m) => `1${m}`)])
}

const applyMemoryMask = (number, mask) => {
  const memoryMask = binaryToNumber(mask)
  // console.log('memory mask', binaryToNumber(mask))
  return number | memoryMask
}

const calculateMemoryAddressesForMask = (memoryAddress, mask) => {
  const interResult = applyMemoryMask(memoryAddress, mask.replaceAll('X', '0'))
  const masks = allMasks(mask.replaceAll('1', '0'))
  return masks.map((m) => applyMask(interResult, m))
}

const testInput = (instructions) => {
  var mask = null
  const memory = {}
  for (const instruction of instructions) {
    if (instruction.type === 'mask') {
      mask = instruction.value
    } else {
      const addresses = calculateMemoryAddressesForMask(instruction.address, mask)
      for (const address of addresses) {
        memory[address] = instruction.value
      }
    }
  }
  console.log('memory', memory)
  const answer = values(memory) |> sum
  console.log('answer', answer)
}

testInput(parseInput('./data/day14Example2.txt'))
testInput(parseInput('./data/day14.txt'))

// console.log(binaryToNumber('0001'))
// console.log(binaryToNumber('0010'))
// console.log(binaryToNumber('0110'))
// console.log(binaryToNumber('0111'))
// console.log(binaryToNumber('111111111111111111111111111111111111'))

// console.log(applyMask(11, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'))
// console.log(applyMask(101, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'))
// console.log(applyMask(0, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'))

// testInput(parseInput('./data/day14.txt'))

// console.log(allMasks('11X'))
// console.log(allMasks('1'))
// console.log(allMasks('11'))
// console.log(allMasks('011'))
// console.log(allMasks('0101'))
// console.log(allMasks('X'))
// console.log(allMasks('X1'))
// console.log(allMasks('1X'))
// console.log(allMasks('011'))
// console.log(allMasks('111'))
// console.log(allMasks('X11'))
// console.log(allMasks('XX'))
// console.log(allMasks('X11X'))
// console.log(allMasks('000000000000000000000000000000X1001X'))

// console.log(calculateMemoryAddressesForMask(42n, '000000000000000000000000000000X1001X'))
// console.log(applyMemoryMask(42n, '000000000000000000000000000000X1001X'))
