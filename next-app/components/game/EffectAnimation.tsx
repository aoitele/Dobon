import React from 'react'
import Image from 'next/image'
import style from './EffectAnimation.module.scss'

const effectAnimation = () => {
  return (
    <div className={style.wrap}>
      <div className={style.imageWrap}>
        <Image
          src="/images/game/effect/dobon.png"
          width={300}
          height={300}
          objectFit="contain"
        />
      </div>
      <div className={style.imageBg}/>
    </div>
  )
}

export default effectAnimation