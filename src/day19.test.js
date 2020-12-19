import { matchesRule } from './day19'

const testCases = [
  { message: 'a', rules: { 0: { subRules: 'a' } }, expectedResult: true },
  { message: 'b', rules: { 0: { subRules: 'a' } }, expectedResult: false },
  {
    message: 'aa',
    rules: {
      0: { subRules: [['1', '1']] },
      1: { subRules: 'a' },
    },
    expectedResult: true,
  },
  {
    message: 'ab',
    rules: {
      0: { subRules: [['1', '1']] },
      1: { subRules: 'a' },
    },
    expectedResult: false,
  },
  {
    message: 'ab',
    rules: {
      0: { subRules: [['1', '2']] },
      1: { subRules: 'a' },
      2: { subRules: 'b' },
    },
    expectedResult: true,
  },
  {
    message: 'a',
    rules: {
      0: { subRules: [['1', '2']] },
      1: { subRules: 'a' },
      2: { subRules: 'b' },
    },
    expectedResult: false,
  },
  {
    message: 'abc',
    rules: {
      0: { subRules: [['1', '2']] },
      1: { subRules: 'a' },
      2: { subRules: 'b' },
    },
    expectedResult: false,
  },
  {
    message: 'abc',
    rules: {
      0: { subRules: [['1', '2']] },
      1: { subRules: [['2', '3']] },
      2: { subRules: 'a' },
      3: { subRules: 'b' },
    },
    expectedResult: false,
  },
  {
    message: 'ab',
    rules: {
      0: {
        subRules: [
          ['1', '1'],
          ['1', '2'],
        ],
      },
      1: { subRules: 'a' },
      2: { subRules: 'b' },
    },
    expectedResult: true,
  },
  {
    message: 'ab',
    rules: {
      0: { subRules: [['2']] },
      2: { subRules: [['3', '4']] },
      3: { subRules: 'a' },
      4: { subRules: 'b' },
    },
    expectedResult: true,
  },
  {
    message: 'ab',
    rules: {
      0: { subRules: [['2']] },
      2: {
        subRules: [
          ['4', '3'],
          ['3', '4'],
        ],
      },
      3: { subRules: 'a' },
      4: { subRules: 'b' },
    },
    expectedResult: true,
  },
  {
    message: 'abc',
    rules: {
      0: {
        subRules: [['4', '3']],
      },
      1: { subRules: 'a' },
      2: { subRules: 'b' },
      3: { subRules: 'c' },
      4: { subRules: [[1, 2]] },
    },
    expectedResult: true,
  },
  {
    message: 'abc',
    rules: {
      0: {
        subRules: [['1'], ['4', '3']],
      },
      1: { subRules: 'a' },
      2: { subRules: 'b' },
      3: { subRules: 'c' },
      4: { subRules: [[1, 2]] },
    },
    expectedResult: true,
  },
]

describe('matchesRule', () => {
  for (const { message, rules, expectedResult } of testCases) {
    test(`matchesRule('${message}', ${JSON.stringify(rules)}) is ${expectedResult}`, () => {
      expect(matchesRule(message, rules)).toBe(expectedResult)
    })
  }
})
