import React from 'react'
import { Routes , Route } from 'react-router-dom'
import LobbyScreen from './screen/LobbyScreen'
import VideoCallPage from './screen/VideoCallPage'
const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<LobbyScreen/>} path='/'/>
        <Route element={<VideoCallPage/>} path='/room/:roomId'/>
      </Routes>
    </div>
  )
}

export default App