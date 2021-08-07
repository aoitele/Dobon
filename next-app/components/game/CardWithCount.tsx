import React from 'react'
import Image from 'next/image'
import type { Deck } from '../../@types/card'
import style from './CardWithCount.module.scss'

interface Cards extends Deck{
    numStyle: 'bottom' | 'right'
}
const CardWithCount:React.FC<Cards> = ({ card, numStyle }) => {
    const cardCount = card.length;
    return (
    <div className={numStyle === 'bottom' ? style.wrapBottom : style.wrapRight}>
        <Image src='/images/cards/z.png' width={40} height={60} className={style.cardImage} />
        <div className={style.cardCountWrap}>
            <span className={style.cardCount}>×{ cardCount }</span>
        </div>
    </div>
    )
}

export default CardWithCount