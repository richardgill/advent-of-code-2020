import { drop, flattenDeep, range, every, compact, last, unzip, first, some, isEqual, take, max } from 'lodash'
import { rotate90, vflip, hflip } from '2d-array-rotation'
import fs from 'fs'

const readFile = (file) => {
  return fs.readFileSync(file).toString().trim()
}

const parseTiles = (tilesString) => {
  return tilesString
    .trim()
    .split('\n\n')
    .map((tile) => {
      const lines = tile.split('\n')
      const tileId = lines[0].match(/Tile (\d+)/)[1]
      const image = drop(lines, 1).map((l) => l.split(''))
      return { tileId, image }
    })
}

// const printTile = (tile) => {
//   return tile.image.map((row) => row.join('')).join('\n')
// }

const topBorder = (tile) => first(tile.image)
const topBorderFlip = (tile) => topBorder(tile).slice().reverse()
const bottomBorder = (tile) => last(tile.image)
const bottomBorderFlip = (tile) => bottomBorder(tile).slice().reverse()
const leftBorder = (tile) => first(unzip(tile.image))
const leftBorderFlip = (tile) => leftBorder(tile).slice().reverse()
const rightBorder = (tile) => last(unzip(tile.image))
const rightBorderFlip = (tile) => rightBorder(tile).slice().reverse()

const allPossibleBorders = (tile) => {
  return [topBorder(tile), bottomBorder(tile), leftBorder(tile), rightBorder(tile)].flatMap((border) => [
    border,
    border.slice().reverse(),
  ])
}

const isAdjacent = (tile1, tile2) => {
  return some(allPossibleBorders(tile1), (border1) => some(allPossibleBorders(tile2), (border2) => isEqual(border1, border2)))
}

const withoutIndex = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)]

const attachAdjacentTiles = (tiles) => {
  return tiles.map((tile, index) => {
    const otherTiles = withoutIndex(tiles, index)
    const adjacent = otherTiles.filter((otherTile) => isAdjacent(tile, otherTile))
    return { ...tile, adjacent }
  })
}

const rotateTile90 = (tile, times) => {
  if (times === 0) {
    return tile
  }
  return rotateTile90({ ...tile, image: rotate90(tile.image) }, times - 1)
}

const flipTileY = (tile) => {
  return { ...tile, image: vflip(tile.image) }
}

const flipTileX = (tile) => {
  return { ...tile, image: hflip(tile.image) }
}

const findAdjacentRight = (tile, tiles) => {
  const tilesWithoutTile = tiles.filter((t) => t.tileId !== tile.tileId)
  const transforms = [
    [leftBorder, (t) => t],
    [leftBorderFlip, flipTileY],
    [rightBorder, flipTileX],
    [rightBorderFlip, (t) => rotateTile90(t, 2)],
    [topBorder, (t) => flipTileY(rotateTile90(t, 3))],
    [topBorderFlip, (t) => rotateTile90(t, 3)],
    [bottomBorder, (t) => rotateTile90(t, 1)],
    [bottomBorderFlip, (t) => flipTileY(rotateTile90(t, 1))],
  ]
  return (
    transforms.map(([borderFunction, transform]) => {
      const matchingTile = tilesWithoutTile.find((t) => isEqual(rightBorder(tile), borderFunction(t)))
      if (matchingTile) {
        return transform(matchingTile)
      }
      return null
    })
    |> compact
    |> first
  )
}

const findAdjacentBelow = (tile, tiles) => {
  const right = findAdjacentRight(rotateTile90(tile, 3), tiles)
  if (!right) {
    return null
  }
  const below = rotateTile90(right, 1)
  if (isEqual(topBorder(below), bottomBorder(tile))) {
    return below
  }
  return flipTileX(below)
}

const buildPictureGrid = (tiles) => {
  // start on a corner!
  const cornerTile = tiles.filter((tile) => tile.adjacent.length === 2)[0]
  // orient top left tile correctly
  let currentTile = findAdjacentBelow(cornerTile, tiles) ? cornerTile : flipTileY(cornerTile)
  currentTile = findAdjacentRight(cornerTile, tiles) ? currentTile : flipTileX(cornerTile)

  let x = 0
  let y = 0
  const picture = [[currentTile]]
  while (true) {
    currentTile = findAdjacentRight(currentTile, tiles)
    if (currentTile) {
      x++
    } else {
      // start on next row
      const firstTileInRow = picture[y][0]
      currentTile = findAdjacentBelow(firstTileInRow, tiles)
      if (!currentTile) {
        return picture
      }
      x = 0
      y++
      picture[y] = []
    }
    picture[y][x] = currentTile
  }
}

const removeBorders = (tile) => {
  return { ...tile, image: tile.image.slice(1, -1).map((row) => row.slice(1, -1)) }
}

const buildPicture = (tiles) => {
  const grid = buildPictureGrid(tiles)
  const picture = grid
    .map((row) => row.map(removeBorders))
    .map((tileRow) => {
      return range(0, tileRow[0].image.length)
        .map((y) => tileRow.map((tile) => tile.image[y].join('')).join(''))
        .join('\n')
    })
    .join('\n')
  return picture
}

const SEA_MONSTER_WIDTH = 20
const SEA_MONSTER_HEIGHT = 3

const SEA_MONSTER_INDEXES = [
  { y: 0, x: 18 },
  { y: 1, x: 0 },
  { y: 1, x: 5 },
  { y: 1, x: 6 },
  { y: 1, x: 11 },
  { y: 1, x: 12 },
  { y: 1, x: 17 },
  { y: 1, x: 18 },
  { y: 1, x: 19 },
  { y: 2, x: 1 },
  { y: 2, x: 4 },
  { y: 2, x: 7 },
  { y: 2, x: 10 },
  { y: 2, x: 13 },
  { y: 2, x: 16 },
]

const isSeaMonster = (window) => every(SEA_MONSTER_INDEXES, ({ y, x }) => window[y][x] === '#')

const pictureToArray = (picture) => picture.split('\n').map((row) => row.split(''))

const findSeaMonstersInPictureArray = (pictureArray) => {
  // Build 'windows' of SEA_MONSTER_HEIGHT x SEA_MONSTER_WIDTH to check for the Sea Monster
  const windows = range(0, pictureArray.length - SEA_MONSTER_HEIGHT + 1)
    .map((i) => {
      return take(drop(pictureArray, i), SEA_MONSTER_HEIGHT)
    })
    .flatMap((window) => {
      return range(0, window[0].length - SEA_MONSTER_WIDTH + 1).map((i) => {
        return window.map((row) => {
          return take(drop(row, i), SEA_MONSTER_WIDTH)
        })
      })
    })
  return windows.filter(isSeaMonster).length
}

const findSeaMonsters = (picture) => {
  const pictureArray = pictureToArray(picture)
  // Flip and rotate the picture all possible ways
  const orientations = [
    pictureArray,
    rotate90(pictureArray),
    rotate90(rotate90(pictureArray)),
    rotate90(rotate90(rotate90(pictureArray))),
  ].flatMap((array) => [array, hflip(array)])
  return orientations.map((orientation) => findSeaMonstersInPictureArray(orientation)) |> max
}

const run = (inputString) => {
  const tiles = attachAdjacentTiles(parseTiles(inputString))
  const picture = buildPicture(tiles)
  const seaMonstersCount = findSeaMonsters(picture)
  console.log('seaMonstersCount: ', seaMonstersCount)
  const seaMonsterHashes = SEA_MONSTER_INDEXES.length * seaMonstersCount
  const hashesInPicture = flattenDeep(pictureToArray(picture)).filter((char) => char === '#').length
  const answer = hashesInPicture - seaMonsterHashes
  console.log('answer: ', answer)
}

if (process.env.NODE_ENV !== 'test') {
  run(readFile('./data/day20Example.txt'))
  run(readFile('./data/day20.txt'))
}
