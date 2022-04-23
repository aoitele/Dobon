import { HandCards } from "../../@types/card"
import { Event } from '../../@types/socket'
import { DOBON_CARD_NAME_JA_H, DOBON_CARD_NAME_JA_S, DOBON_CARD_NAME_JA_C, DOBON_CARD_NAME_JA_D, DOBON_CARD_NAME_JA_X } from '../../constant'
import spreadCardState from './spreadCardState'

const suitNameTo__Ja = (card: HandCards | string): { suit: string, num: number} => {
  const _card = spreadCardState([card])
  const suit: 'h' | 's' | 'c' | 'd' | 'x' = _card[0].suit
  const num = _card[0].num

  switch (suit) {
    case 'h' : return { suit: DOBON_CARD_NAME_JA_H, num }
    case 's' : return { suit: DOBON_CARD_NAME_JA_S, num }
    case 'c' : return { suit: DOBON_CARD_NAME_JA_C, num }
    case 'd' : return { suit: DOBON_CARD_NAME_JA_D, num }
    case 'x' : return { suit: DOBON_CARD_NAME_JA_X, num }
    default  : return { suit: '', num: 0 }
  }
}

interface Props {
  action: Event
  card: HandCards | string
}

const createMsg = ({ action, card }:Props) => {
  const cardInfo = suitNameTo__Ja(card)
  switch (action) {
    case 'dobon'           : return `「${cardInfo.suit}の${cardInfo.num}」でどぼん！`
    case 'dobonsuccess'    : return `どぼん成功！`
    case 'dobonfailure'    : return `どぼん失敗！`
    case 'joker'           : return `「ジョーカー(0)」\n手札合計21ならどぼん可能！全てのカードが出せます`
    case 'skip'            : return `「スキップ(1)」\n次のユーザーをスキップします`
    case 'wild'            : return `「ワイルド(8)」\n選択した柄なら全て出せます`
    case 'reverse'         : return `「リバース(11)」\nターン順を反転します`
    case 'opencard'        : return `「手札公開(13)」\n次のユーザーは手札を公開！`
    default                : return ''
  }
}

export { suitNameTo__Ja, createMsg }