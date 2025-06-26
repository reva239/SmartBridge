import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const user = useRef();
  const pwd = useRef();
  const confirmPwd = useRef();
  const address = useRef();
  const phone = useRef();
  const age = useRef();
  const email = useRef();

  const handleSubmit = async () => {

    if (pwd.current.value !== confirmPwd.current.value) {
      alert('Passwords do NOT match!');
      return;
    }

    const res = await fetch('http://localhost:8082/signup', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        type:'user',
        user: user.current.value,
        pwd: pwd.current.value,
        email: email.current.value,
        address: address.current.value,
        phone: phone.current.value,
        age: age.current.value,
      }),
    });
    const result = await res.json();

    if (result.status) {
      alert('Account Created!');
      navigate('/')
    } else {
      alert(result.message || 'Sign Up Failed');
    }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='flex justify-around items-center flex-col rounded-xl text-white bg-gray-700 p-3 gap-5'>
        <h1 className='font-bold text-2xl'>Sign Up</h1>
        <form
          action='#'
          onSubmit={()=>handleSubmit()}
          className='flex flex-col justify-center items-center gap-2'
        >
          <div className='flex flex-row gap-2'>
             <div className='flex flex-col justify-center items-center gap-2'>
                 <label>User Name :</label>
                 <input
                   required
                   type='text'
                   ref={user}
                   className='py-2 px-3 rounded-xl bg-white text-black'
                   placeholder='user'
                 />
       
                 <label>Password :</label>
                 <input
                   required
                   type='password'
                   ref={pwd}
                   className='py-2 px-3 rounded-xl bg-white text-black'
                   placeholder='pwd'
                 />
       
                 <label>Confirm Password :</label>
                 <input
                   required
                   type='password'
                   ref={confirmPwd}
                   className='py-2 px-3 rounded-xl bg-white text-black'
                   placeholder='confirm pwd'
                 />
          </div>

          <div className='flex flex-col justify-center items-center'>

                 <label>Address :</label>
                 <input
                   required
                   type='text'
                   ref={address}
                   className='py-2 px-3 rounded-xl bg-white text-black'
                   placeholder='address'
                 />
       
                 <label>Email :</label>
                 <input
                   required
                   type='email'
                   ref={email}
                   className='py-2 px-3 rounded-xl bg-white text-black'
                   placeholder='email'
                 />
       
                 <label>Phone :</label>
                 <input
                   required
                   type='tel'
                   ref={phone}
                   className='py-2 px-3 rounded-xl bg-white text-black'
                   placeholder='phone'
                 />
       
                 <label>Age :</label>
                 <input
                   required
                   type='number'
                   ref={age}
                   className='py-2 px-3 rounded-xl bg-white text-black'
                   placeholder='age'
                 />
          </div>
          </div>

          <button className='text-lg text-gray-700 bg-white rounded-xl w-18 h-10'>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
