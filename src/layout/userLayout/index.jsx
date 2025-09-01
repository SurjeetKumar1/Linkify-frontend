import React from 'react'
import Navbar from '@/components/navbar'

function userLayout({children}) {
  return (
    <div>
        <Navbar/>
      {children}
    </div>
  )
}

export default userLayout
