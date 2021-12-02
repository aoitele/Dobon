import React, { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import { HaveAllPropertyCard } from '../../@types/card'
import styles from './SingleCard.module.scss'

type Props = {
  card: HaveAllPropertyCard & {
      style?: {
        width: number,
        height: number
    }
  }
  setSelectedCard?: Dispatch<SetStateAction<string>>
}

export const SingleCard: React.FC<Props> = ({ card, setSelectedCard }) => {
  const { style, isOpen, suit, num, isPutable } = card
  const width = style?.width || 40
  const height = style?.height || 60
  return (
    <div className={styles.imageWrap} onClick={ setSelectedCard && isPutable ? () => setSelectedCard(`${suit}${num}`) : undefined }>
      { isOpen
      ? <Image src={`/images/cards/${suit}${num}.png`} width={width} height={height} />
      : <Image src="/images/cards/z.png" width={width} height={height} />
      }
    </div>
  )
}
