import { useState } from 'react'
import {Route,Routes} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import AdminDashboard from './components/Admin/Dashboard'
function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/admin' element={<AdminDashboard/>} />
    </Routes>

  )
}

export default App
