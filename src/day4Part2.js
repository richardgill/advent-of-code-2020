import fs from 'fs'
import { filter, size, map, every, flatMap, fromPairs, omitBy, isNil, keys, intersection } from 'lodash/fp'
import Regularity from 'regularity'

const mandatoryFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']

const passports =
  fs.readFileSync('./data/day4.txt').toString().trim().split('\n\n')
  |> map((s) => {
    return s.split('\n') |> flatMap((x) => x.split(' ')) |> map((field) => field.split(':')) |> fromPairs
  })

const mandatoryFieldsPresent = (passport) => {
  const fieldsPresent = passport |> omitBy(isNil) |> keys
  return (intersection(fieldsPresent, mandatoryFields) |> size) === size(mandatoryFields)
}

const isFieldBetween = (s, length, min, max) => {
  const digitsRegex = new Regularity().startWith(length, 'digit').endWith('').done()
  const fieldAsInt = parseInt(s, 10)
  return digitsRegex.test(s) && fieldAsInt >= min && fieldAsInt <= max
}

const isBirthYearValid = (passport) => isFieldBetween(passport.byr, 4, 1920, 2002)
const isIssueYearValid = (passport) => isFieldBetween(passport.iyr, 4, 2010, 2020)
const isExpirationYearValid = (passport) => isFieldBetween(passport.eyr, 4, 2020, 2030)

const isHeightValid = (passport) => {
  if (passport.hgt.endsWith('cm')) {
    return isFieldBetween(passport.hgt.replace('cm', ''), 3, 150, 193)
  }
  if (passport.hgt.endsWith('in')) {
    return isFieldBetween(passport.hgt.replace('in', ''), 2, 59, 76)
  }
  return false
}

const hairColorValidRegex = new Regularity().startWith('#').endWith(6, 'alphanumeric').done()

const isHairColorValid = (passport) => {
  return hairColorValidRegex.test(passport.hcl)
}

const isEyeColorValid = (passport) => validEyeColors.includes(passport.ecl)

const passportValidRegex = new Regularity().startWith(9, 'digit').endWith('').done()

const isPassportIdValid = (passport) => {
  console.log(passportValidRegex)
  return passportValidRegex.test(passport.pid)
}

const isPasswordValid = (passport) => {
  if (!mandatoryFieldsPresent(passport)) {
    return false
  }
  const result = {
    byr: {
      value: passport.byr,
      valid: isBirthYearValid(passport),
    },
    iyr: {
      value: passport.iyr,
      valid: isIssueYearValid(passport),
    },
    eyr: {
      value: passport.eyr,
      valid: isExpirationYearValid(passport),
    },
    hgt: {
      value: passport.hgt,
      valid: isHeightValid(passport),
    },
    hcl: {
      value: passport.hcl,
      valid: isHairColorValid(passport),
    },
    ecl: {
      value: passport.ecl,
      valid: isEyeColorValid(passport),
    },
    pid: {
      value: passport.pid,
      valid: isPassportIdValid(passport),
    },
  }
  console.log('\n\n', result)
  return result |> every((r) => r.valid)
}

const answer = passports |> filter(isPasswordValid) |> size

console.log(answer)
