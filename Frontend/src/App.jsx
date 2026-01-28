import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import AdminDashboard from './components/Admin/Dashboard'
import DriverDashboard from './components/Driver/Dashboard'
import ManagerDashboard from './components/Manager/Dashboard'
import AddDriver from './components/Manager/AddDriver'
import Home from './components/User/Home'
function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/home' element={<Home/>} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/admin' element={<AdminDashboard />} />
      <Route path='/driver' element={<DriverDashboard />} />
      <Route path='/manager' element={<ManagerDashboard />} />
      <Route path='/manager/add-driver' element={<AddDriver />} />
  

    </Routes>

  )
}

export default App
