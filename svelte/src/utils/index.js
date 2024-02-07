// num between 0 and 1
export const interpolate = (num, bound1, bound2) => {
  return bound1 + num * (bound2 - bound1)
}

export const clamp = (num, bound1, bound2) => {
  const min = Math.min(bound1, bound2)
  const max = Math.max(bound1, bound2)
  return Math.min(Math.max(num, min), max)
}
