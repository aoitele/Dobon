/**
 **
 * 出されたカード(putOutCard) / 手札(hand)
 * 手札が1枚の場合： 出されたカードと手札の数字が合致すればドボン(単騎待ち)
 * 手札が2枚の場合： 出されたカードが手札2枚の合計値/もしくは差分と合致すればドボン
 * 手札が3枚以上の場合： 出されたカードが手札の合計値と合致すればドボン
 * 
 * 出されたカードがJoker(0)1枚の場合、計算値が21であればドボン
 * 手札にJoker(0)が含まれる場合、手札数にかかわらず+1/-1どちらでも使える
 */
const dobonJudge = (putOutCard: number, hand: number[]): boolean => {
    let judgeNumber = putOutCard; 
    const cardCnt = hand.length;
    const isPutOutJoker = putOutCard === Number(process.env.NEXT_PUBLIC_JOKER_DOBON_NUMBER); // Jokerが出されたか
    const existJokerInHand = hand.includes(Number(process.env.NEXT_PUBLIC_JOKER_CARD_NUMBER)); // 手札にJokerがあるか
    const cntJokerInHand = hand.filter(x => x === Number(process.env.NEXT_PUBLIC_JOKER_CARD_NUMBER)).length;
    const judgeMethod = cardCnt === 1 ? 'single' : cardCnt === 2 ? 'sumAndDiff' : 'sum';

    switch (judgeMethod) {
        case 'single':
            return hand[0] === judgeNumber;

        case 'sumAndDiff':
            if (isPutOutJoker) {
                judgeNumber = Number(process.env.NEXT_PUBLIC_JOKER_DOBON_NUMBER); // 上がれる数が21となる
            }
            if (existJokerInHand) {
                return judgeWithJokerSumAndDiff(judgeNumber, hand, cntJokerInHand);
            }
            return sum(hand) === judgeNumber ? true : diff(hand[0], hand[1]) === judgeNumber;            
        
        case 'sum':
            if (existJokerInHand) {
                return judgeWithJokerSumAndDiff(judgeNumber, hand, cntJokerInHand);
            }
            return sum(hand) === judgeNumber;
        default:
            return false;
    }
}

const sum = (data: number[]) => data.reduce((acc, cur) => acc + cur);
const diff = (arg1:number, arg2:number) => Math.abs(arg1 - arg2);
const judgeWithJokerSumAndDiff = (judgeNumber: number, hand: number[], cntJokerInHand: number): boolean => {
    if (cntJokerInHand === 1) {
        return Math.abs(sum(hand) - judgeNumber) === 1;
    } 
        const matcher = [-2, 0, 2];
        return matcher.includes(sum(hand) - judgeNumber);
    
} 

export { dobonJudge }