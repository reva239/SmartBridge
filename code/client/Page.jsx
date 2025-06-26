import React, { useContext, useState } from 'react'
import { ContextData } from './src/context/context'
import Home from './src/components/Home'
import Bookkings from './src/components/Bookkings'
import { useNavigate } from 'react-router-dom'
import PostFlight from './src/components/PostFlight'

export const Page = () => {
  const {type} = useContext(ContextData)
  const navigate = useNavigate();
  const [tab,setTab] = useState('home');

  console.log(type)

  if(type === '') navigate('/')

  return (
    <>
     <div className='flex w-full flex-row justify-end items-center bg-gray-800 p-3'>
         <div className='flex flex-row justify-end items-center gap-2'>
            <button className='px-3 py-2 rounded-lg bg-white text-black' onClick={()=>setTab('home')}>Home</button>
            <button className='px-3 py-2 rounded-lg bg-white text-black' onClick={()=>setTab('booklogs')}>Booklogs</button>
            {type === 'admin' && <button className='px-3 py-2 rounded-lg bg-white text-black' onClick={()=>setTab('flights')}>Fights</button>}
         </div>
     </div>
     { tab === 'home' &&  <Home />}
     { tab === 'booklogs' &&  <Bookkings/>}
     { tab === 'flights' &&  <PostFlight />}
     
    </>
  )
}
