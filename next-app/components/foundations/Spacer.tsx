import React, { FC } from 'react'

interface Props {
  size: number
  axis?: 'vertical' | 'horizontal'
  style?: {
    [key:string]: string
  }
}
 
const Spacer: FC<Props> = ({ size, axis, style = {}, ...delegated }) => {
  const width = axis === 'vertical' ? 1 : size
  const height = axis === 'horizontal' ? 1 : size

  return (
    <span
      style={{
        display: 'block',
        width,
        minWidth: width,
        height,
        minHeight: height,
        ...style,
      }}
      {...delegated}
    />
  )
}

export { Spacer }