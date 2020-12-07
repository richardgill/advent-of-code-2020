import fs from 'fs'
import { sum } from 'lodash'
import { map, find, flatMap, compact } from 'lodash/fp'

const parseContainsBags = (ruleText) => {
  if (ruleText.includes('no other bags')) {
    return []
  }
  return (
    ruleText.split(',')
    |> map((rule) => {
      const matches = rule.match(/(\d+) (.+) bag(s*)/)
      const count = parseInt(matches[1], 10)
      const color = matches[2]
      return { color, count }
    })
  )
}

const bagColorRegex = /^(.+) bag(s*) contain /
const parseRule = (ruleText) => {
  const color = ruleText.match(bagColorRegex)[1]
  return { color, contains: parseContainsBags(ruleText.replace(bagColorRegex, '')) }
}

const buildRuleTree = (rule, rules) => {
  const rootRule = rules |> find((r) => r.color === rule.color)
  return { ...rule, contains: rootRule.contains |> map((r) => buildRuleTree(r, rules)) }
}

const flattenContains = (rule, parentCount) => {
  const count = rule.count * parentCount
  return (
    [rule.count && { color: rule.color, count }, ...(rule.contains |> flatMap((r) => flattenContains(r, count || 1)))] |> compact
  )
}
const rules = fs.readFileSync('./data/day7.txt').toString().trim().split('\n') |> map(parseRule)

const goldBagRule =
  rules
  |> map((rule) => buildRuleTree(rule, rules))
  |> map((r) => ({ ...r, contains: flattenContains(r) }))
  |> find((r) => r.color === 'shiny gold')

const answer = goldBagRule.contains |> map((r) => r.count) |> sum

console.log(answer)
