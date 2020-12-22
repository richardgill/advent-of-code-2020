import fs from 'fs'
import { isEmpty, drop, take, sum, flatten } from 'lodash'

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

const decksToString = (decks) => {
  return `${decks[0].join(',')}|${decks[1].join(',')}`
}

const haveSeenDecksBefore = (decks, previousDecks) => {
  return previousDecks[decksToString(decks)]
}

const playRecursiveCombat = ([deck1, deck2], previousDecks = {}) => {
  if (isEmpty(deck1)) {
    return [[], deck2]
  }
  if (isEmpty(deck2)) {
    return [deck1, []]
  }
  if (haveSeenDecksBefore([deck1, deck2], previousDecks)) {
    return [deck1, []]
  }

  previousDecks[decksToString([deck1, deck2])] = true

  const deck1Top = deck1[0]
  const deck2Top = deck2[0]
  let isPlayer1Winner
  if (deck1Top < deck1.length && deck2Top < deck2.length) {
    const subGameResult = playRecursiveCombat([take(drop(deck1, 1), deck1Top), take(drop(deck2, 1), deck2Top)], {})
    isPlayer1Winner = isEmpty(subGameResult[1])
  } else {
    isPlayer1Winner = deck1Top > deck2Top
  }

  if (isPlayer1Winner) {
    return playRecursiveCombat([[...drop(deck1, 1), deck1Top, deck2Top], drop(deck2, 1)], previousDecks)
  }
  return playRecursiveCombat([drop(deck1, 1), [...drop(deck2, 1), deck2Top, deck1Top]], previousDecks)
}

const run = (inputString) => {
  const decks = parseDecks(inputString)
  console.log('decks', decks)
  const winningDeck = flatten(playRecursiveCombat(decks))
  console.log('winning deck', winningDeck)
  const answer =
    winningDeck
      .slice()
      .reverse()
      .map((card, index) => card * (index + 1)) |> sum
  console.log('answer', answer)
  console.log('\n')
}

if (process.env.NODE_ENV !== 'test') {
  const loopForeverExample = `
  Player 1:
  43
  19

  Player 2:
  2
  29
  14
    `
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
  run(loopForeverExample)
  run(readFile('./data/day22.txt'))
}
