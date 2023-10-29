import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            <body>
                <div class="flex flex-wrap justify-center">
                    <div class="w-80">
                        <h3 class="text-center mb-4 text-3xl font-bold text-black">Assigning Detail</h3>
                        <form class="mt-4" onSubmit={handleSubmit}>
                            <div class="mb-6">
                                <label for="contact" class="block mb-2 text-sm font-medium text-black">Traveller ID</label>
                                <input type="number" id="contact" name="contact" onChange={handleChange} class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <div class="mb-6">
                                <label for="password" class="block mb-2 text-sm font-medium text-black">Tour Guide ID</label>
                                <input type="password" id="password" name="password" onChange={handleChange} class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>

                            <div>
                                {error && <p class="text-center font-bold text-red-500">{error}</p>}
                            </div>

                            <div>
                                <center>
                                    <button type="submit" class="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Assign</button>
                                </center>
                            </div>
                        </form>
                    </div>
                </div>
            </body>
        </>
    )
};

export default CitizenLoginForm;