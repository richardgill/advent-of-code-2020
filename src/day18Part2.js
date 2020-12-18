import fs from 'fs'
import { isObject, isNumber, sum } from 'lodash'

const readFile = (file) => {
  return fs.readFileSync(file).toString().trim()
}

const startsWithNumber = (s) => /^\d+/.test(s)

const extractNumber = (s) => parseInt(s.match(/^\d+/)[0], 10)

const removeNumber = (s) => s.replace(/^\d+/, '')

const findClosingParentheses = (s) => {
  let parenCount = 0
  for (let index = 0; index < s.length; index++) {
    const char = s[index]
    if (char === '(') {
      parenCount++
    }
    if (char === ')') {
      parenCount--
      if (parenCount === 0) {
        return index
      }
    }
  }
  throw new Error("Couldn't find paren close!")
}

const parseTreeHelper = (expressionString, expressionSoFar = 0) => {
  if (expressionString === '') {
    return expressionSoFar
  }
  if (startsWithNumber(expressionString)) {
    const value = isObject(expressionSoFar)
      ? { ...expressionSoFar, args: [...expressionSoFar.args, extractNumber(expressionString)] }
      : extractNumber(expressionString)

    return parseTreeHelper(removeNumber(expressionString), value)
  }
  if (expressionString[0] === '+') {
    return parseTreeHelper(expressionString.slice(1), { op: '+', args: [expressionSoFar] })
  }
  if (expressionString[0] === '*') {
    return { op: '*', args: [expressionSoFar, parseTreeHelper(expressionString.slice(1))] }
  }
  if (expressionString[0] === '(') {
    const closeIndex = findClosingParentheses(expressionString)
    const insideParens = expressionString.slice(1, closeIndex)
    const afterParens = expressionString.slice(closeIndex + 1)
    const value = isObject(expressionSoFar)
      ? {
          ...expressionSoFar,
          args: [...expressionSoFar.args, parseTreeHelper(insideParens)],
        }
      : parseTreeHelper(insideParens)
    return parseTreeHelper(afterParens, value)
  }
  throw new Error(`unknown expression start :${expressionString}`)
}

export const calculateParseTree = (expressionStringRaw) => {
  return parseTreeHelper(expressionStringRaw.replace(/\s/g, ''))
}

export const evaluateHelper = (parseTree) => {
  if (isNumber(parseTree)) {
    return parseTree
  }
  if (parseTree.op === '+') {
    return evaluateHelper(parseTree.args[0]) + evaluateHelper(parseTree.args[1])
  }
  if (parseTree.op === '*') {
    return evaluateHelper(parseTree.args[0]) * evaluateHelper(parseTree.args[1])
  }
  throw new Error(`Evaluate error: ${parseTree}`)
}

export const evaluate = (expressionString) => {
  const tree = calculateParseTree(expressionString)
  return evaluateHelper(tree)
}
if (process.env.NODE_ENV !== 'test') {
  console.log(readFile('./data/day18.txt'))
  const values = readFile('./data/day18.txt').split('\n').map(evaluate)
  const answer = sum(values)

  console.log(values)
  console.log('answer', answer)
}
