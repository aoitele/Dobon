import React from 'react'
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
}

export const SingleCard: React.FC<Props> = ({ card }) => {
  const { style, isOpen, suit, num } = card
  const width = style?.width || 40
  const height = style?.height || 60
  return (
    <div className={styles.imageWrap}>
      { isOpen
      ? <Image src={`/images/cards/${suit}${num}.png`} width={width} height={height} />
      : <Image src="/images/cards/z.png" width={width} height={height} />
      }
    </div>
  )
}
