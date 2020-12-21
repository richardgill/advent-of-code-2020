import fs from 'fs'
import { intersection, fromPairs, flatten, difference, every, toPairs } from 'lodash'
import { uniq, filter, mapValues, map, sortBy } from 'lodash/fp'

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

const dangerousIngredientsListHelper = (allergensCouldBeCaused) => {
  if (every(allergensCouldBeCaused, (foods) => foods.length === 1)) {
    return allergensCouldBeCaused
  }
  const knownAllergenFoods = allergensCouldBeCaused |> filter((foods) => foods.length === 1) |> flatten
  const newAllergenCouldBeCaused =
    allergensCouldBeCaused |> mapValues((foods) => (foods.length > 1 ? difference(foods, knownAllergenFoods) : foods))
  return dangerousIngredientsListHelper(newAllergenCouldBeCaused)
}

const dangerousIngredientsList = (ingredients) => {
  const allergensCouldBeCaused = allergensCouldBeCausedBy(ingredients)
  const allergenToFood = dangerousIngredientsListHelper(allergensCouldBeCaused)
  const list =
    allergenToFood
    |> toPairs
    |> map(([allergen, food]) => ({ food: food[0], allergen }))
    |> sortBy('allergen')
    |> map((r) => r.food)

  return list.join(',')
}

const run = (inputString) => {
  const ingredients = parseIngredients(inputString)
  console.log('answer', dangerousIngredientsList(ingredients))
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
