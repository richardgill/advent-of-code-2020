/* eslint-disable */
function solveMMI(a, mod) {
  const b = a % mod
  for (let x = 1n; x < mod; x++) {
    if ((b * x) % mod === 1n) {
      return x
    }
  }
  return 1n
}

/**
 * @param {{a: bigint, n: bigint}[]} system
 */
export const solveCRT = (system) => {
  const prod = system.reduce((p, con) => p * con.n, 1n)
  return (
    system.reduce((sm, con) => {
      const p = prod / con.n
      return sm + con.a * solveMMI(p, con.n) * p
    }, 0n) % prod
  )
}
