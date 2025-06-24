/* eslint-disable no-unused-vars */
import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL

const Login = () => {

    const [email,setEmail] = useState('');
    const [password,setPass] = useState('');
    const [message,setMessage] = useState('');
    const navigate = useNavigate();

    const handleEmail = (e)=>{
        setEmail(e.target.value);
    }
    const handlePassword =(e)=>{
        setPass(e.target.value)
    }

    const handleSignupnav=()=>{
        navigate('/signup');

    }

 

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            const response = await fetch(`${BACKEND_BASE_URL}/api/login`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({email,password})
            });

            const data = await  response.json();
            if(response.ok){
                localStorage.setItem('token', data.token); 
                setMessage('Login Successful!')
                localStorage.setItem('email',email);
                setTimeout(()=>{
                    navigate('/')
                },1000)
            
                setEmail('')
                setPass('')
            }
            else{
                setMessage('Login Failed')
            }

        }
        catch(err){
            setMessage('Error'+err.message);
        }


    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9] font-[Segoe UI]">
          <form
            onSubmit={handleSubmit}
            className="w-[400px] bg-white px-10 py-16 rounded-xl shadow-lg text-center"
          >
            <h1 className="text-[28px] font-bold mb-8">Sign in Now</h1>
      
            <div className="flex flex-col gap-4 mb-6">
              <input
                type="email"
                onChange={handleEmail}
                placeholder="Enter your email"
                className="py-3 px-6 rounded-full border border-gray-300 text-base outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all"
              />
              <input
                type="password"
                onChange={handlePassword}
                placeholder="Enter your password"
                className="py-3 px-6 rounded-full border border-gray-300 text-base outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all"
              />
            </div>
      
            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="w-1/2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full text-base font-semibold transition-colors mb-4"
              >
                Sign in
              </button>
      
              <p className="text-sm text-gray-500">
                Don&apos;t have an account
                <span
                  onClick={handleSignupnav}
                  className="ml-1 text-black font-medium cursor-pointer underline"
                >
                  Sign Up
                </span>
              </p>
            </div>
      
            {message && (
              <p className="mt-5 text-green-600 text-sm font-medium">{message}</p>
            )}
          </form>
        </div>
      );
      }

export default Login;
