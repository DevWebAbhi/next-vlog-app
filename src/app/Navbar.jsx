"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

const Navbar = ({deleteCookies, userDetails}) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  useEffect(()=>{
    console.log(userDetails)
  },[])

  return (
    <div className='p-5 flex justify-between items-center fixed z-50 top-0 left-0 w-full bg-white shadow-md'>
      <div>
        <h1 className='text-2xl font-semibold'><Link href={'/'}>Next Vlog</Link></h1>
      </div>
      <div className='hidden md:flex justify-around items-center'>
        <button className='ml-3 mr-3' onClick={e => router.push('/createVlog')}>Create Vlog</button>
        <button className='ml-3 mr-3' onClick={e => router.push('/aiTool')}>AI Tool</button>
        {
          userDetails && userDetails.Username ?
            <>
            <button onClick={e => router.push('/user')} className='ml-3 mr-3 username-color'>{userDetails.Username}</button>
            <button onClick={e => { deleteCookies(); }} className='ml-3 mr-3'>Logout</button>
            </>
            : <button className='ml-3 mr-3' onClick={e => router.push('/user')}>Login</button>
        }
        

      </div>
      <div className='md:hidden'>
        <button onClick={toggleMenu} className='focus:outline-none'>
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16m-7 6h7'></path>
          </svg>
        </button>
      </div>
      <div className={`${menuOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-white shadow-md`}>
        <button onClick={e => { toggleMenu(); router.push('/createVlog'); }} className='block w-full text-left p-3'>Create Vlog</button>
        <button onClick={e => { toggleMenu(); router.push('/aiTool'); }} className='block w-full text-left p-3'>AI Tool</button>
        {
          userDetails && userDetails.userName ?
          <>
          <button onClick={e => {toggleMenu(); router.push('/user')}} className='ml-3 mr-3 username-color'>{userDetails.Username}</button>
          <button onClick={e => {toggleMenu(); deleteCookies(); }} className='block w-full text-left p-3'>Logout</button>
          </>
            : <button onClick={e => { toggleMenu(); router.push('/user'); }} className='block w-full text-left p-3'>Login</button>
        }
        
      </div>
    </div>
  )
}

export default Navbar
