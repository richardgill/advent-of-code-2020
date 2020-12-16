import fs from 'fs'
import { drop, flatten, sum, some } from 'lodash'

const parseRange = (rangeString) => rangeString.split('-').map((x) => parseInt(x, 10))

const parseRule = (ruleString) => {
  const [field, rest] = ruleString.split(': ')
  const ranges = rest.split(' or ').map(parseRange)

  return { field, ranges }
}

const parseRules = (rulesString) => rulesString.split('\n').map(parseRule)

const parseTicket = (ticketString) => ticketString.split(',').map((x) => parseInt(x, 10))

const parseInput = (file) => {
  const [rulesString, yourTicketString, nearbyTicketsString] = fs.readFileSync(file).toString().trim().split('\n\n')
  const rules = parseRules(rulesString)
  const yourTicket = parseTicket(yourTicketString.split('\n')[1])
  const nearbyTickets = drop(nearbyTicketsString.split('\n'), 1).map(parseTicket)
  return { rules, yourTicket, nearbyTickets }
}

const isInRange = (number, [lower, upper]) => {
  return number >= lower && number <= upper
}

const isNumberValid = (number, rules) => {
  return some(rules, (rule) => some(rule.ranges, (range) => isInRange(number, range)))
}

const testInput = (input) => {
  const answer = flatten(input.nearbyTickets).filter((number) => !isNumberValid(number, input.rules)) |> sum
  console.log('answer', answer)
}

testInput(parseInput('./data/day16Example.txt'))
testInput(parseInput('./data/day16.txt'))
