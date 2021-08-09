import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Card } from '../../@types/card'

export const SingleCard:React.FC<Card> = ({suit, num, isOpen}) => {
    const [isOpened, setIsOpened] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        setIsOpened(typeof isOpen !== 'undefined' && isOpen)
        setIsLoading(false)
    }, [isOpen])
    
    return (
        isLoading ? <></> 
        : isOpened
            ? <Image src={`/images/cards/${suit}${num}.png`} width={40} height={60}/> 
            : <Image src='/images/cards/z.png' width={40} height={60}/>
    )
}