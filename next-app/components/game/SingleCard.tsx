import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Card } from '../../@types/card'

export const SingleCard:React.FC<Card> = ({suit, num, open}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        setIsOpen(typeof open !== 'undefined' && open)
        setIsLoading(false)
    }, [open])
    
    return (
        isLoading ? <></> 
        : isOpen 
            ? <Image src={`/images/cards/${suit}${num}.png`} width={40} height={60}/> 
            : <Image src='/images/cards/z.png' width={40} height={60}/>
    )
}