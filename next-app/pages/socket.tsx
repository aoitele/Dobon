import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
const socket = io(`${process.env.NEXT_PUBLIC_SERVER_SOCKETIO_ALLOW_ORIGIN}`)

const socketApp = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [lastMessage, setLastMessage] = useState(null)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      setIsConnected(false)
    })
    socket.on('message', (data) => {
      setLastMessage(data)
    })
    socket.on('hello', (data) => {
      console.log(data)
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('message')
    }
  })

  const sendMessage = () => {
    socket.emit('chat message', 'hello2')
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Connected: {`${isConnected}`}</p>
        <p>Last message: {lastMessage || '-'}</p>
        <button onClick={sendMessage}>Say hello!</button>
      </header>
    </div>
  )
}

export default socketApp
