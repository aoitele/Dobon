import React, { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import { HaveAllPropertyCard } from '../../@types/card'
import { InitialBoardState } from '../../@types/game'
import styles from './SingleCard.module.scss'
import { DOBON_CARD_NUMBER_WILD } from '../../constant'

type Props = {
  card: HaveAllPropertyCard & {
      style?: {
        width: number,
        height: number
    }
  }
  values?: InitialBoardState
  setValues?: Dispatch<SetStateAction<InitialBoardState>> | Dispatch<InitialBoardState>
}

export const SingleCard: React.FC<Props> = ({ card, values, setValues }) => {
  const { style, isOpen, suit, num, isPutable } = card
  const width = style?.width || 40
  const height = style?.height || 60
  const numIs8 = num === DOBON_CARD_NUMBER_WILD
  return (
    <div className={styles.imageWrap} onClick={ 
      values && setValues && isPutable
      ? () => setValues({
        ...values,
        selectedCard: `${suit}${num}`,
        selectedWildCard: {
          isSelected: numIs8,
          suit: numIs8 ? suit : null
        }
      })
      : undefined
    }>
      { isOpen
      ? <Image
          key={`${suit}${num}-Image`}
          src={`/images/cards/${suit}${num}.png`}
          width={width}
          height={height}
        />
      : <Image src="/images/cards/z.png" width={width} height={height} />
      }
    </div>
  )
}
