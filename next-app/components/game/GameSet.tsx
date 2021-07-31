import React from 'react'
interface Props {
    gameSet: number;
    setCount: number;
}

export const GameSet:React.FC<Props> = ({ gameSet, setCount }) => <p>game: {gameSet} / {setCount} </p>