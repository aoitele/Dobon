import React from 'react'
import Image from 'next/image'
import { Card } from '../../@types/card'
import styles from './SingleCard.module.scss'

type Props = Card & { style?: { width: number, height: number }}

export const SingleCard: React.FC<Props> = ({ suit, num, isOpen, style }) => {
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
