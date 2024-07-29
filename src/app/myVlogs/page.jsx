import React from 'react'
import MyVlogsProvider from './myVlogsProvider'
import { cookies } from 'next/headers'

const page = () => {
  const cookieStore = cookies();
  return (
    <MyVlogsProvider userDetails={(cookieStore && cookieStore.get("nextvlogauthuserdetails") && cookieStore.get("nextvlogauthuserdetails").value && JSON.parse(cookieStore.get("nextvlogauthuserdetails").value)) || {}}/>
  )
}

export default page