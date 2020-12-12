import { rotate, moveToWayPoint } from './day12Part2'

const rotateTestCases = [
  {
    input: [
      { instruction: 'R', magnitude: 90 },
      { x: 2, y: 1 },
    ],
    expected: { x: 1, y: -2 },
  },
  {
    input: [
      { instruction: 'R', magnitude: 90 },
      { x: 1, y: -2 },
    ],
    expected: { x: -2, y: -1 },
  },
  {
    input: [
      { instruction: 'R', magnitude: 90 },
      { x: -2, y: -1 },
    ],
    expected: { x: -1, y: 2 },
  },
  {
    input: [
      { instruction: 'R', magnitude: 180 },
      { x: 2, y: 1 },
    ],
    expected: { x: -2, y: -1 },
  },
  {
    input: [
      { instruction: 'L', magnitude: 90 },
      { x: 2, y: 1 },
    ],
    expected: { x: -1, y: 2 },
  },
]

describe('rotate', () => {
  for (const testCase of rotateTestCases) {
    test(`${JSON.stringify(testCase.input)} returns ${JSON.stringify(testCase.expected)}`, () => {
      expect(rotate(...testCase.input)).toStrictEqual(testCase.expected)
    })
  }
})

const moveToWayPointTestCases = [
  {
    input: [
      { instruction: 'F', magnitude: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 0 },
    ],
    expected: { x: 2, y: 1 },
  },
  {
    input: [
      { instruction: 'F', magnitude: 10 },
      { x: 2, y: 1 },
      { x: 0, y: 0 },
    ],
    expected: { x: 20, y: 10 },
  },
  {
    input: [
      { instruction: 'F', magnitude: 7 },
      { x: 10, y: 4 },
      { x: 100, y: 10 },
    ],
    expected: { x: 170, y: 38 },
  },
]

describe('moveToWayPoint', () => {
  for (const testCase of moveToWayPointTestCases) {
    test(`${JSON.stringify(testCase.input)} returns ${JSON.stringify(testCase.expected)}`, () => {
      expect(moveToWayPoint(...testCase.input)).toStrictEqual(testCase.expected)
    })
  }
})
