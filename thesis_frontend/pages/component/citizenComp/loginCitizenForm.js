import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebLayout_V1 from '../../layout/layout_v1';
// import { useAuth } from '../utils/authContext';
// import SessionCheck from '../utils/sessionCheck';

const CitizenLoginForm = () => {
    const router = useRouter()

    const [error, setError] = useState('')
    const [loginData, setLoginData] = useState({
        contact: 0,
        password: "",
    })

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        loginData.contact = parseInt(loginData.contact)
        console.log(loginData);

        if (!loginData.contact || !loginData.password) {
            setError("Contact and Password are required!")
        } else {
            try {
                const response = await axios.post(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'login', loginData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    });

                console.log(response);
                if (response.data == "Citizen Login Successful!") {
                    router.push('citizenDashboard')
                } else {
                    setError("Invalid Citizen!")
                }
            } catch (error) {
                console.error('Error Citizen Login:', error);
            }
        }
    };

    // const doLogin = async (e) => {
    //     try {
    //         const response = await axios.post(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'login',
    //             {
    //                 loginData
    //             },
    //             {
    //                 withCredentials: true
    //             });

    //         console.log(response);
    //         if (response.data == "Citizen Login Successful!") {
    //             router.push('citizenDashboard')
    //         } else {
    //             setError("Invalid Citizen!")
    //         }
    //     } catch (error) {
    //         console.error('Error Citizen Login:', error);
    //     }
    // }

    return (
        <>
            {/* <SessionCheck /> */}

            <body className='bg-full-screen'>
                <WebLayout_V1 title={'Login - Citizen'}>
                    <div class="center w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 glass-container-login">
                        <form class="space-y-6" onSubmit={handleSubmit}>
                            <h5 class="text-center mb-4 text-2xl font-bold text-white">Log in to our platform</h5>
                            <div>
                                <label for="contact" class="block mb-2 text-sm font-medium text-white dark:text-white">Citizen Contact Number</label>
                                <input type="number" name="contact" id="contact" placeholder="01*********" onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-white dark:text-white">Your Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                            </div>
                            <div>
                                {error && <p class="text-center font-bold text-red-700">{error}</p>}
                            </div>
                            <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">login</button>
                            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <center> Not registered? <a href="citizenRegistration" class="text-blue-600 hover:underline dark:text-blue-500">Create account</a> </center>
                            </div>
                        </form>
                    </div>
                </WebLayout_V1>
            </body >
        </>
    )
};

export default CitizenLoginForm;