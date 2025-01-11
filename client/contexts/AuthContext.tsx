'use client'

import { getLoggedInUser, logoutUser } from '@/apicalls/authApiCalls';
import { IUser } from '@/interfaces/interfaces';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLoader } from './LoaderContext';

type AuthContextType = {
  user: IUser | null;
  setUser: Function;
  logoutFromUserContext:Function;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const {setIsLoading} = useLoader()

  const fetchLoggedInUser = async() =>{
    setIsLoading(true)
    const res = await getLoggedInUser()
    if(res.error){
        setUser(null)
    }else{
        setUser(res.user)
    }
    setIsLoading(false)
  }

  const logoutFromUserContext=async()=>{
    const res = await logoutUser()
    if(res){
        setUser(null)
    }
  }

  useEffect(()=>{
    fetchLoggedInUser()
  },[])

  return (
    <AuthContext.Provider value={{ user, setUser, logoutFromUserContext }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}