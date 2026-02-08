import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Applayout from '../layout/AppLayout'


const ProtectedRoute = () => {
    const {isAuthenticated,loading}=useAuth()
    if(loading){
         return <div>loading... </div>
    }
  return isAuthenticated ? (
    <Applayout>
        <Outlet />
    </Applayout>
  ):<Navigate to='/login' replace />
    
}

export default ProtectedRoute;
