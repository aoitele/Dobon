const culcGetScore = (cards: number[], isReverseDobon = false) => {
    const score = cards.reduce((acc, cur) => {
        if(cur === 0) cur = 2;
        if(cur > 10) cur = 10;
        return acc * cur
    })
    return isReverseDobon ? score * 2 : score;
}

export { culcGetScore }