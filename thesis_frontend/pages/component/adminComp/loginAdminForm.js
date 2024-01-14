import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebLayout_V1 from '../../layout/layout_v1';
// import { useAuth } from '../utils/authContext';
// import SessionCheck from '../utils/sessionCheck';

const AdminLoginForm = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // const { login } = useAuth();

    // useEffect(() => {
    //     if (typeof window !== 'undefined') // checks if the code is running on the client-side and not on the server-side.
    //     {
    //         const session = sessionStorage.getItem('username');
    //         console.log("session: " + session);

    //         if (session) {
    //             setUsername(sessionStorage.getItem('username'));
    //             console.log(username);
    //             router.push('../manager/home');
    //         }
    //     }
    // }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    // const [signInData, setSignInData] = useState({
    //   username: "",
    //   password: "",
    // });
    // const handleChange = (e) => {
    //   setSignInData({ ...signInData, [e.target.name]: e.target.value });
    // };

    const isValidUsername = (username) => {
        const usernamePattern = /^\S+.\S+$/;
        return usernamePattern.test(username);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Username and Password are required!');
        } else if (!isValidUsername(username)) {
            setError('Invalid Username!')
        } else {
            console.log({ username, password });

            const res = await doLogin(username, password)
            console.log(res);
        }
    };

    const doLogin = async (e) => {
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'login',
                {
                    username, password
                },
                {
                    withCredentials: true
                });
            console.log(response.data)
            if (response.data == "Admin Login Successful!") {
                // sessionStorage.setItem('username', response.data);
                // sessionStorage.getItem(document.cookie)
                // console.log(document.cookie);
                // alert('Admin Login Successful!')
                router.push('citizens');
            } else {
                setError("Invalid Admin!")
            }

        } catch (error) {
            console.log(error)
            //alert("Not Mach Data")
        }
    }

    return (
        <>
            {/* <SessionCheck /> */}
            
            <body className='bg-full-screen'>
                <WebLayout_V1 title={"Login - Admin"}>
                    <div class="center w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 glass-container-login">
                        <form class="space-y-6" onSubmit={handleSubmit}>
                            <h5 class="text-center mb-4 text-2xl font-bold text-white">Log in to our platform</h5>
                            <div>
                                <label for="username" class="block mb-2 text-sm font-medium text-white dark:text-white">Your Username</label>
                                <input type="text" name="username" id="username" placeholder="xyz" value={username} onChange={handleUsernameChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-white dark:text-white">Your Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" value={password} onChange={handlePasswordChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                            </div>
                            <div>
                                {error && <p class="text-center font-bold text-red-700">{error}</p>}
                            </div>
                            <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">login</button>
                            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                <center> Not registered? <a href="adminRegistration" class="text-blue-600 hover:underline dark:text-blue-500">Create account</a> </center>
                            </div>
                        </form>
                    </div>
                </WebLayout_V1>

                {/* <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div class="center">
                        <h3 class="text-center mb-4 text-3xl font-bold text-white">Admin Credentials</h3>
                        <br></br>
                        <form class="mt-4" onSubmit={handleSubmit}>

                            <div class="mb-6">
                                <label for="username" class="block mb-2 text-sm font-medium text-white">Username</label>
                                <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <div class="mb-6">
                                <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
                                <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>

                            <div>
                                {error && <p class="text-center font-bold text-red-500">{error}</p>}
                            </div>

                            <div>
                                <center>
                                    <button type="submit" class="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">LOGIN</button>
                                    <br></br><br></br>
                                    <Link href="adminRegistration" class="font-medium text-green-700 dark:text-blue-500 hover:underline">Not Registered?</Link>
                                </center>
                            </div>
                        </form>
                    </div>
                </div> */}

            </body>
        </>
    );
};

export default AdminLoginForm;