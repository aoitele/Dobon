const culcGetScore = (cards: number[], isReverseDobon = false) => {
  const score = cards.reduce((acc, cur) => {
    const curNum = cur === 0 ? 2 : cur > 10 ? 10 : cur
    return acc * curNum
  })
  return isReverseDobon ? score * 2 : score
}

export { culcGetScore }
