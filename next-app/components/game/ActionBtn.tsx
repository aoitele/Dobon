import React from 'react'
import style from './ActionBtn.module.scss'

interface Props {
  text: string
  styleClass: string
}

const actionBtn: React.FC<Props> = ({ text, styleClass }) => {
  return (
    <div className={`${style[styleClass]}`}>{text}</div>
  )
}

export default actionBtn
