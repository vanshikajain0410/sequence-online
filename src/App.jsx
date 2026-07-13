import { useState, useEffect } from 'react'
import Home from './components/Home'
import Lobby from './components/Lobby'
import Game from './components/Game'

function App() {
  const [screen, setScreen] = useState('home')
  const [sessionInfo, setSessionInfo] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomId = params.get('room')
    if (roomId) setScreen('lobby-via-link')
  }, [])

  function handleRoomCreated({ roomId, browserId, playerName }) {
    setSessionInfo({ roomId, browserId, playerName })
    setScreen('lobby')
  }

  function handleRoomJoined({ roomId, browserId, playerName }) {
    setSessionInfo({ roomId, browserId, playerName })
    setScreen('lobby')
  }

  function handleGameStart({ players }) {
    setSessionInfo(prev => ({ ...prev, players }))
    setScreen('game')
  }

  if (screen === 'lobby-via-link') {
    const params = new URLSearchParams(window.location.search)
    const roomId = params.get('room')

    if (!sessionInfo) {
      return (
        <Home
          onRoomCreated={handleRoomCreated}
          onRoomJoined={({ roomId, browserId, playerName }) => {
            setSessionInfo({ roomId, browserId, playerName })
            setScreen('lobby')
          }}
          prefillRoomCode={roomId}
        />
      )
    }
  }

  if (screen === 'home') {
    return <Home onRoomCreated={handleRoomCreated} onRoomJoined={handleRoomJoined} />
  }

  if (screen === 'lobby') {
    return (
      <Lobby
        roomId={sessionInfo.roomId}
        browserId={sessionInfo.browserId}
        onGameStart={handleGameStart}
      />
    )
  }

  if (screen === 'game') {
    return <Game players={sessionInfo.players} />
  }
}

export default App