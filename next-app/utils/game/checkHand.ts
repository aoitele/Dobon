import type { Action } from '../../@types/game';

const card2 = Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO);
const card13 = Number(process.env.NEXT_PUBLIC_RANK_CARD_OPENCARD);

const isPutOut2or13 = (putOutCard: number) => [card2, card13].includes(putOutCard);
const hasSameCard = (putOutCard: number, hand: number[]): boolean => hand.includes(putOutCard);
const chkAvoidCardEffect = (action: Action) => action === 'avoidEffect';

export { isPutOut2or13, hasSameCard, chkAvoidCardEffect }