import React from 'react'
import Navbar from './Navbar'
import { cookies } from "next/headers";
const NavbarProvider = ({children}) => {
    const cookieStore = cookies();
  return (
    <>
    
    <Navbar userDetails={(cookieStore && cookieStore.get("nextvlogauthuserdetails") && cookieStore.get("nextvlogauthuserdetails").value && JSON.parse(cookieStore.get("nextvlogauthuserdetails").value)) || {}}/>
    {children}
    </>
  )
}

export default NavbarProvider