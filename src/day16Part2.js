import fs from 'fs'
import { isEmpty, first, drop, unzip, difference, some, every, flatten, intersection } from 'lodash'
import { map } from 'lodash/fp'

const product = (array) => {
  if (isEmpty(array)) {
    return 1
  }
  return first(array) * product(drop(array, 1))
}

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

const isValidForRule = (number, rule) => {
  return some(rule.ranges, (range) => isInRange(number, range))
}
const isNumberValid = (number, rules) => {
  return some(rules, (rule) => isValidForRule(number, rule))
}

const narrowDownFields = (fields) => {
  const knownFields = flatten(fields.filter((f) => f.length === 1))
  if (knownFields.length === fields.length) {
    return fields
  }
  const narrowedDownFields = fields.map((f) => {
    if (f.length === 1) {
      return f
    }
    return difference(f, knownFields)
  })
  return narrowDownFields(narrowedDownFields)
}

const calculateFieldIndexes = (tickets, rules) => {
  const possibleTicketFields =
    tickets.map((ticket) =>
      ticket.map((number) => rules.filter((rule) => isValidForRule(number, rule)).map((rule) => rule.field)),
    ) |>
    // unzip transposes the array e.g. if ticket has 3 fields: [[['row', 'seat'], ['seat']], ...]
    unzip
    |> map((fields) => intersection(...fields))
  return flatten(narrowDownFields(possibleTicketFields))
}
const testInput = (input) => {
  const validTickets = input.nearbyTickets.filter((ticket) => every(ticket, (number) => isNumberValid(number, input.rules)))
  const indexToField = calculateFieldIndexes([...validTickets, input.yourTicket], input.rules)
  const departureIndexes = indexToField
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => field.startsWith('departure'))
    .map(({ index }) => index)
  const answer = departureIndexes.map((index) => input.yourTicket[index]) |> product
  console.log('answer', answer)
}

testInput(parseInput('./data/day16Example2.txt'))
// testInput(parseInput('./data/day16Example.txt'))
testInput(parseInput('./data/day16.txt'))
