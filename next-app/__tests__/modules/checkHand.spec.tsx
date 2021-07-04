/**
 **
 * 2と13のカードは同じ数字が手札にあれば、効果を次のユーザーに流すことができる
 * 2か13が出された場合は3秒間ユーザーの入力を待ち、その間に同数値のカードを出すか/出さないかを選択できる
 * 入力がない場合は効果を受け入れると処理し、ゲームが続行する
 */
import {isPutOut2or13, hasSameCard, chkAvoidCardEffect} from '../../utils/playing/checkHand'

describe('checkHand TestCases', () => {
    it('2か13が出されたか', () => {
        const putOutCard1 = 2;
        const putOutCard2 = 11;
        const putOutCard3 = 13;
        const putOutCard4 = 0;

        const result1 = isPutOut2or13(putOutCard1);
        const result2 = isPutOut2or13(putOutCard2);
        const result3 = isPutOut2or13(putOutCard3);
        const result4 = isPutOut2or13(putOutCard4);
       
        expect(result1).toBe(true);
        expect(result2).toBe(false);
        expect(result3).toBe(true);
        expect(result4).toBe(false);
    })
    it('出されたカードと同じ数字のカードが手札にあるか', () => {
        const putOutCard = 4;
        const hand1 = [3, 1, 4];
        const hand2 = [5, 9];

        const result1 = hasSameCard(putOutCard, hand1);
        const result2 = hasSameCard(putOutCard, hand2);
       
        expect(result1).toBe(true);
        expect(result2).toBe(false);
    })
    it('2か13が出された時、同数字を出す指示が出た', async() => {
        expect.assertions(1);
        const result = chkAvoidCardEffect('avoidEffect');       
        expect(result).toBe(true);
    })
    it('2か13が出された時、同数字を出さない指示が出た', async() => {
        expect.assertions(1);
        const result = chkAvoidCardEffect('notAvoidEffect');       
        expect(result).toBe(false);
    })
})