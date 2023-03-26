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
    case 'joker'           : return `「ジョーカー」\n手札合計21ならどぼん可能!全てのカードが出せます`
    case 'skip'            : return `「スキップ(1)」\n次のユーザーをスキップします`
    case 'wild'            : return `「ワイルド(8)」\n選択した柄なら全て出せます`
    case 'wildclub'        : return `「ワイルド(8) - クラブ」\nクラブ柄なら全て出せます`
    case 'wilddia'         : return `「ワイルド(8) - ダイヤ」\nダイヤ柄なら全て出せます`
    case 'wildheart'       : return `「ワイルド(8) - ハート」\nハート柄なら全て出せます`
    case 'wildspade'       : return `「ワイルド(8) - スペード」\nスペード柄なら全て出せます`
    case 'reverse'         : return `「リバース(11)」\nターン順を反転します`
    case 'opencard'        : return `「手札公開(13)」\n次のユーザーは手札を公開!`
    case 'draw2'           : return `「ドロー2」\n次のユーザーはカードを2枚ドロー!`
    case 'draw4'           : return `「ドロー4」\n次のユーザーはカードを4枚ドロー!`
    case 'draw6'           : return `「ドロー6」\n次のユーザーはカードを6枚ドロー!`
    case 'draw8'           : return `「ドロー8」\n次のユーザーはカードを8枚ドロー!`
    default                : return ''
  }
}

export { suitNameTo__Ja, createMsg }