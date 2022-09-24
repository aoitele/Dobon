/**
 * 与えられたカード情報と組み合わせる枚数指定による
 * 組み合わせパターンを返す関数
 * maisu分カードを選ぶ中でカード情報のremain(残枚数)が0になった場合は、組み合わせパターンとして生成させない
 */
export interface CombinationProps {
  cards: {
    number: number // カードの数字(1〜13)
    remain: number // 残枚数(0〜4)
  }[]
  maisu: number // 組み合わせる枚数の指定 eg 2 >> [1, 2], 3 >> [1, 2, 3]
}

export const combination = ({ cards, maisu }: CombinationProps) => {
  const result: number[][] = []

  /* eslint-disable no-continue, max-depth */
  for (let i=0; i<cards.length; i+=1) {
    if (cards[i].remain === 0) continue // カードの残枚数が0であれば組み合わせには利用しない

    const first = cards[i].number // 1枚目
    cards[i].remain -= 1 // 1枚目の残カードを減らす

    for (let j=0; j<cards.length; j+=1) {
      if (cards[j].remain === 0) continue // 1枚目で引いたカードの残枚数が0であれば組み合わせには利用しない
      const second = cards[j].number // 2枚目

      // 指定が2枚の場合、最大196通りについて計算
      if (maisu === 2) {
        result.push([first, second])
      }
      // 指定が2枚の場合、最大2743通りについて計算
      if (maisu === 3) {
        cards[j].remain -= 1 // 2枚目の残カードを減らす
        for (let k=0; k<cards.length; k+=1) {
          if (cards[k].remain === 0) continue // 1, 2枚目で引いたカードの残枚数が0であれば組み合わせには利用しない
          const third = cards[k].number // 3枚目
          result.push([first, second, third])
        }
        cards[j].remain += 1 // 2枚目の残カードを元に戻す
      }
    }
    cards[i].remain += 1 // 1枚目の残カードを元に戻す
  }
  /* eslint-enable no-continue, max-depth */
 
  return result 
}
