import fs from 'fs'
import { isEmpty, drop, sum } from 'lodash'

const readFile = (file) => {
  return fs.readFileSync(file).toString().trim()
}
const parseDecks = (inputString) => {
  return inputString
    .trim()
    .split('\n\n')
    .map((deckString) =>
      deckString
        .split('\n')
        .slice(1)
        .map((card) => parseInt(card, 10)),
    )
}
const playCombat = ([deck1, deck2]) => {
  if (isEmpty(deck1)) {
    return deck2
  }
  if (isEmpty(deck2)) {
    return deck1
  }
  const deck1Top = deck1[0]
  const deck2Top = deck2[0]
  if (deck1Top > deck2Top) {
    return playCombat([[...drop(deck1, 1), deck1Top, deck2Top], drop(deck2, 1)])
  }
  return playCombat([drop(deck1, 1), [...drop(deck2, 1), deck2Top, deck1Top]])
}

const run = (inputString) => {
  const decks = parseDecks(inputString)
  console.log('decks', decks)
  const winningDeck = playCombat(decks)
  console.log(winningDeck)
  const answer =
    winningDeck
      .slice()
      .reverse()
      .map((card, index) => card * (index + 1)) |> sum
  console.log('answer', answer)
}

if (process.env.NODE_ENV !== 'test') {
  const example = `
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
  `
  run(example)
  run(readFile('./data/day22.txt'))
}
