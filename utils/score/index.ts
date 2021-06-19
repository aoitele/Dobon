const culcGetScore = (cards: number[]) => {
    return cards.reduce((acc, cur) => {
        if(cur === 0) cur = 2;
        if(cur > 10) cur = 10;
        return acc * cur
    })
}

export { culcGetScore }