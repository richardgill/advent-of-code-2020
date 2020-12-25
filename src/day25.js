const REMAINDER = 20201227

const doLoop = (value, subjectNumber, remainder = REMAINDER, times = 1) => {
  while (times > 0) {
    value = (value * subjectNumber) % remainder
    times--
  }
  return value
}

const findLoopSize = (publicKey, value = 1, subjectNumber = 7, remainder = REMAINDER) => {
  let loopSize = 0
  while (publicKey !== value) {
    value = doLoop(value, subjectNumber, remainder)
    loopSize++
  }
  return loopSize
}

const findEncrpytionKey = (cardPublicKey, doorPublicKey) => {
  const cardLoopSize = findLoopSize(cardPublicKey)
  const encryptionKey = doLoop(1, doorPublicKey, REMAINDER, cardLoopSize)
  return encryptionKey
}

const run = (cardPublicKey, doorPublicKey) => {
  const encryptionKey = findEncrpytionKey(cardPublicKey, doorPublicKey)
  console.log('answer', encryptionKey)
  console.log('\n')
}

if (process.env.NODE_ENV !== 'test') {
  // run(5764801, 17807724)

  run(12232269, 19452773)
}
