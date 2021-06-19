import { culcGetScore } from '../../../utils/score/index'

describe('Score TestCases', () => {
    it('与えられたカードの合計積を計算する', () => {
        const cards = [2, 4, 10];
        const expected = 80;

        const result = culcGetScore(cards);
        expect(result).toStrictEqual(expected)
    })
    it('11以上のカードは10でスコア計算が行われる', () => {
        const cards = [10, 11];
        const expected = 100;

        const result = culcGetScore(cards);
        expect(result).toStrictEqual(expected)
    })
    it('joker(0)は、計算時は2として扱う', () => {
        const cards = [10, 0, 11, 3];
        const expected = 600;

        const result = culcGetScore(cards);
        expect(result).toStrictEqual(expected)
    })
})