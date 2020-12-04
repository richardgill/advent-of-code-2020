import fs from 'fs'
import { filter, size, map, flatMap, fromPairs, omitBy, isNil, keys, intersection } from 'lodash/fp'

const mandatoryFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

const passports =
  fs.readFileSync('./data/day4.txt').toString().trim().split('\n\n')
  |> map((s) => {
    return s.split('\n') |> flatMap((x) => x.split(' ')) |> map((field) => field.split(':')) |> fromPairs
  })

const isPasswordValid = (passport) => {
  const fieldsPresent = passport |> omitBy(isNil) |> keys
  return (intersection(fieldsPresent, mandatoryFields) |> size) === size(mandatoryFields)
}

console.log(passports)

const answer = passports |> filter(isPasswordValid) |> size

console.log(answer)
