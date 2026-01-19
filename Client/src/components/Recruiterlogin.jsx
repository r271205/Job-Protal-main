import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";


    function Recruiterlogin(){

        const [state,setState] = useState('Log in');
        const [name,setName] = useState('');
        const [email,setEmail] = useState('');
        const [password,setPassword] = useState('');
        
        const [image,setImage] = useState(false);
        const [isTextDataSubmited,setisTextDataSubmited] = useState(false);
        
        const navigate = useNavigate();

        const {setisRecruiterLogin,backendUrl,setcompanyData,setcompanyToken} = useContext(AppContext);

        const onSubmitHandler = async (e) => {
            e.preventDefault()
            
            if(state === "Sign up" && !isTextDataSubmited){
                setisTextDataSubmited(true);
                return; 
            }

            try {
                if (state === "Log in") {
                    const {data} = await axios.post(backendUrl+'/api/company/login',{email,password});

                    if(data?.success){
                        setcompanyData(data.company)
                        setcompanyToken(data.token)
                        localStorage.setItem('companyToken',data.token)
                        setisRecruiterLogin(false)
                        navigate('/dashboard')
                    }
                    else{
                        toast.error(data.message)
                    }
                }
                else{

                    const formData = new FormData();

                    formData.append('name',name);
                    formData.append('email',email);
                    formData.append('password',password);
                    formData.append('image',image);

                    const {data} = await axios.post(backendUrl + '/api/company/register',formData);
                    if(data.success){
                        setcompanyData(data.company)
                        setcompanyToken(data.token)
                        localStorage.setItem('companyToken',data.token)
                        setisRecruiterLogin(false)
                        navigate('/dashboard')
                    }
                }
            } 
            catch (error) {
                toast.error(error.message);
            }
        }

        useEffect(() => {
            document.body.style.overflow = "hidden"

            return () => {
                document.body.style.overflow = "unset"
            }
        },[])

        return(
            <div className = " absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center ">
                <form  onSubmit = {onSubmitHandler} className = " relative bg-white p-10 rounded-xl text-slate-500">

                    <h1 className = " text-center text-2xl text-neutral-700 font-medium">Recruiter {state}</h1>
                    <p className = " text-sm">Welcome back! Please sign in to continue</p>
                    {state === "Sign up" && isTextDataSubmited 
                        ?<>
                            <div className = "flex items-center py-10 gap-2">
                                <label htmlFor = "image" className = "cursor-pointer">
                                    <img className = "rounded-full w-16 " src = {image ? URL.createObjectURL(image): assets.upload_area} alt="" />
                                    <input onChange = {e => setImage(e.target.files[0])} type = "file" id = "image" hidden />
                                </label>
                                <p>Uplode Company <br />logo</p>
                            </div>
                        </>
                        :<>
                        {state === 'Sign up' && (
                            <div className = " border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
                                <img src = {assets.person_icon} alt="" />
                                <input className = " outline-none text-sm" onChange = {e => setName(e.target.value)} value = {name} type="text" placeholder = "Company Name" required/>
                            </div>
                        )}

                        <div className = " border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
                            <img src = {assets.email_icon} alt="" />
                            <input className = " outline-none text-sm" onChange = {e => setEmail(e.target.value)} value = {email} type="email" placeholder = "Email Id" required/>
                        </div>

                        <div className = " border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
                            <img src = {assets.lock_icon} alt="" />
                            <input className = " outline-none text-sm" onChange = {e => setPassword(e.target.value)} value = {password} type = "password" placeholder = "password" required/>
                        </div>

                        </>
                    } 
                    
                    {state === 'Log in' &&
                        <p className = " text-sm text-blue-600 my-2 cursor-pointer">Forgot password?</p>
                    }

                    <button type = "submit" className = " border rounded-full text-white bg-blue-500 w-full py-2 mt-2 hover:cursor-pointer ">{state === 'Log in' ? 'Login' : isTextDataSubmited ? 'create account' : 'next'}</button>

                    {state === 'Log in' 
                        ? <p className = "text-center mt-5 " >Don't have an account ? <span className = " text-blue-600 cursor-pointer " onClick = {() => setState('Sign up')}>Sing up</span></p> 
                        : <p className = "text-center mt-5 hover" >Alredy have an account ? <span className = " text-blue-600 cursor-pointer " onClick = {() => setState('Log in')}>Login</span></p>
                    }
                    <img onClick = {() => setisRecruiterLogin(false) } className = "absolute top-5 right-5 cursor-pointer " src = {assets.cross_icon} alt="" />
                </form>
            </div>
        );
    }

    export default Recruiterlogin;