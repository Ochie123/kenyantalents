"use client"
import React from 'react'
import { ModalSearchProvider } from '@/context/ModalSearchContext'

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
 
                <ModalSearchProvider>
                {children}
                </ModalSearchProvider>

    )
}

export default GlobalProvider