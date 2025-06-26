import React, { useContext, useEffect, useRef, } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextData } from './context/context';

export const Login = () => {
  const {type,setType,setUser,setUserId} = useContext(ContextData)
  useEffect(() => {
    setType('user');
  }, [setType]); // ✅ Run only ONCE
  const user = useRef();
  const pwd = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevent page refresh
    const res = await fetch('http://localhost:8082/login', {
      method: 'POST',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        type,
        user: user.current.value,
        pwd: pwd.current.value,
      }),
    });
    const result = await res.json();
    if (result.status) {
      setUser(result.user)
      setUserId(result.id)
      navigate('/page')
    } else {
      alert('Not Found');
    }
  };

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='flex justify-around items-center flex-col rounded-xl text-white bg-gray-700 p-3 gap-5'>
        <h1 className='font-bold text-2xl'>Login</h1>
        <form
          action='#'
          onSubmit={handleSubmit}
          className='flex flex-col justify-center items-center gap-3'
        >
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
            type='text'
            ref={pwd}
            className='py-2 px-3 rounded-xl bg-white text-black'
            placeholder='pwd'
          />
          
          <select onChange={(event) => setType(event.target.value)} className='text-black'>
            <option value={'user'}>user</option>
            <option value={'admin'} >admin</option>
          </select>
          
          <button className='text-lg text-gray-700 bg-white rounded-xl w-18 h-10'>
            Submit
          </button>
        </form>
        {type === 'user' && (
          <div className='flex flex-row text-base font-medium gap-2'>
            Don't you have an account?
            <div className='text-blue-500 cursor-pointer' onClick={() => navigate('/signup')}>
              SignUp
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
