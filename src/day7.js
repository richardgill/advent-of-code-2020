import fs from 'fs'
import { map, find, flatMap, filter, size, includes } from 'lodash/fp'

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

const flattenContains = (rule) => {
  return [...rule.contains, ...(rule.contains |> flatMap(flattenContains))]
}
const rules = fs.readFileSync('./data/day7.txt').toString().trim().split('\n') |> map(parseRule)

const ruleTree = rules |> map((rule) => buildRuleTree(rule, rules))

const answer =
  ruleTree
  |> map((r) => ({ ...r, contains: flattenContains(r) }))
  |> filter((r) => {
    console.log(r.contains |> map('color'))
    return r.contains |> map('color') |> includes('shiny gold')
  })
  |> size

console.log(answer)
