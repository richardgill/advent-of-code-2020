import fs from 'fs'
import { intersection, fromPairs, values, flatten, difference } from 'lodash'
import { uniq } from 'lodash/fp'

const readFile = (file) => {
  return fs.readFileSync(file).toString().trim()
}

const parseIngredients = (ingredientsString) => {
  return ingredientsString
    .trim()
    .split('\n')
    .map((ingredientString) => {
      const [foodsString, allergensString] = ingredientString.split('(contains ')
      const foods = foodsString.trim().split(' ')
      const allergens = allergensString.trim().slice(0, -1).split(', ')
      return { foods, allergens }
    })
}

const allergensCouldBeCausedBy = (ingredients) => {
  const allAllergens = ingredients.flatMap((i) => i.allergens) |> uniq
  return (
    allAllergens.map((allergen) => {
      const ingredientsWhichIncludeAllergen = ingredients.filter((ingredient) => ingredient.allergens.includes(allergen))
      const foods = ingredientsWhichIncludeAllergen.map((i) => i.foods)
      return [allergen, intersection(...foods)]
    }) |> fromPairs
  )
}

const couldBeAllergen = (ingredients) => {
  const causedBy = allergensCouldBeCausedBy(ingredients)
  return uniq(flatten(values(causedBy)))
}

const allFoods = (ingredients) => {
  return ingredients.flatMap((i) => i.foods)
}

const run = (inputString) => {
  const ingredients = parseIngredients(inputString)
  const nonAllergenFoods = difference(allFoods(ingredients), couldBeAllergen(ingredients))
  console.log('answer: ', nonAllergenFoods.length)
}

if (process.env.NODE_ENV !== 'test') {
  const example = `
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
  `
  run(example)
  run(readFile('./data/day21.txt'))
}
