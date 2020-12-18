import { calculateParseTree, evaluate } from './day18Part2'

const parseTreeTestCases = [
  { input: '1', expectedParseTree: 1, expectedValue: 1 },
  { input: '25', expectedParseTree: 25, expectedValue: 25 },
  { input: '1+1', expectedParseTree: { op: '+', args: [1, 1] }, expectedValue: 2 },
  { input: '25+1', expectedParseTree: { op: '+', args: [25, 1] }, expectedValue: 26 },
  { input: '25 + 26', expectedParseTree: { op: '+', args: [25, 26] }, expectedValue: 51 },
  { input: '+ 1', expectedParseTree: { op: '+', args: [0, 1] }, expectedValue: 1 },
  { input: '1*1', expectedParseTree: { op: '*', args: [1, 1] }, expectedValue: 1 },
  { input: '25*1', expectedParseTree: { op: '*', args: [25, 1] }, expectedValue: 25 },
  { input: '25 * 26', expectedParseTree: { op: '*', args: [25, 26] }, expectedValue: 650 },
  { input: '* 1', expectedParseTree: { op: '*', args: [0, 1] }, expectedValue: 0 },
  { input: '1 + 2 * 3', expectedParseTree: { op: '*', args: [{ op: '+', args: [1, 2] }, 3] }, expectedValue: 9 },
  { input: '1 + 2 + 3', expectedParseTree: { op: '+', args: [{ op: '+', args: [1, 2] }, 3] }, expectedValue: 6 },
  { input: '1 + (2 * 3)', expectedParseTree: { op: '+', args: [1, { op: '*', args: [2, 3] }] }, expectedValue: 7 },
  { input: '1 + (2 + 3)', expectedParseTree: { op: '+', args: [1, { op: '+', args: [2, 3] }] }, expectedValue: 6 },
  {
    input: '1 + ((2 + 3) * 4)',
    expectedParseTree: { op: '+', args: [1, { op: '*', args: [{ op: '+', args: [2, 3] }, 4] }] },
    expectedValue: 21,
  },
  { input: '1 * 2 + 3', expectedParseTree: { op: '*', args: [1, { op: '+', args: [2, 3] }] }, expectedValue: 5 },
  { input: '2 * 2 + 6', expectedParseTree: { op: '*', args: [2, { op: '+', args: [2, 6] }] }, expectedValue: 16 },
]
const evaluateTestCases = [
  { input: '1 + (2 * 3) + (4 * (5 + 6))', expectedValue: 51 },
  { input: '2 * 3 + (4 * 5)', expectedValue: 46 },
  { input: '5 + (8 * 3 + 9 + 3 * 4 * 3)', expectedValue: 1445 },
  { input: '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', expectedValue: 669060 },
  { input: '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', expectedValue: 23340 },
]

describe('calculateParseTree', () => {
  for (const testCase of parseTreeTestCases) {
    test(`${testCase.input} returns ${JSON.stringify(testCase.expectedParseTree)}`, () => {
      expect(calculateParseTree(testCase.input)).toStrictEqual(testCase.expectedParseTree)
    })
  }
})

describe('evaluate', () => {
  for (const testCase of [...parseTreeTestCases, ...evaluateTestCases]) {
    test(`${testCase.input} returns ${JSON.stringify(testCase.expectedValue)}`, () => {
      expect(evaluate(testCase.input)).toStrictEqual(testCase.expectedValue)
    })
  }
})
