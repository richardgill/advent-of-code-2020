import { toUpper, kebabCase } from 'lodash/fp'

const b = 'Foo bar' |> kebabCase |> toUpper
console.log(b)
console.log('Day 2')
const o = { x: { y: 1 } }

console.log(o?.x?.y)
console.log(o?.z?.a)

export const sum = (a1, b1) => a1 + b1
