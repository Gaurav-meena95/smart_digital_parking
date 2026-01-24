import { useState } from 'react'
import {Route,Routes} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Auth/Login'
function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/login' element={<Login/>} />
    </Routes>

  )
}

export default App
