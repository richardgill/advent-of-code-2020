import { isString, some, every, flattenDeep } from 'lodash'
import { keyBy } from 'lodash/fp'
import fs from 'fs'

const readFile = (file) => {
  return fs.readFileSync(file).toString().trim()
}

const parseSubRule = (subRuleString) => {
  if (subRuleString.startsWith('"')) {
    return subRuleString.slice(1, -1)
  }
  return subRuleString.split(' | ').map((subRule) => subRule.split(' '))
}

const parseRule = (ruleString) => {
  const [ruleName, rule] = ruleString.split(': ')

  const subRules = parseSubRule(rule)
  return { ruleName, subRules }
}

const parseRules = (input) => {
  const rules = input.trim().split('\n\n')[0]
  return rules.split('\n').map(parseRule) |> keyBy((rule) => rule.ruleName)
}

const parseMessages = (input) => {
  return input.trim().split('\n\n')[1].split('\n')
}

export const matchesRuleHelper = (message, rules, ruleName = '0') => {
  const firstChar = message[0]
  const rule = rules[ruleName]
  if (isString(rule.subRules)) {
    return [[firstChar === rule.subRules]]
  }

  const orMatches = rule.subRules.flatMap((subRule) => {
    const andMatches = subRule.reduce(
      (soFars, r) => {
        return soFars.flatMap((soFar) => {
          const matches = matchesRuleHelper(message.slice(soFar.length), rules, r)
          return matches.filter((match) => every(match)).map((match) => flattenDeep([...soFar, match]))
        })
      },
      [[]],
    )
    return andMatches
  })
  return orMatches
}

export const matchesRule = (message, rules, ruleName = '0') => {
  const matches = matchesRuleHelper(message, rules, ruleName)
  return some(matches, (match) => every(match) && match.length === message.length)
}

const run = (inputString) => {
  const rules = parseRules(inputString)
  const messages = parseMessages(inputString)
  const answer = messages.filter((message) => matchesRule(message, rules)).length
  console.log('answer: ', answer)
}

if (process.env.NODE_ENV !== 'test') {
  const exampleInput = `
  0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`

  run(exampleInput)
  run(readFile('./data/day19.txt'))
}
