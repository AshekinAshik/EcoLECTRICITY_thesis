import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            <body>
                <div class="flex flex-wrap justify-center">
                    <div class="center">
                        <form class="mt-4" onSubmit={handleSubmit}>
                            <h3 align="center">ADMIN LOGIN</h3>
                            <br></br>
                            <div class="mb-6">
                                <label for="username" class="block mb-2 text-sm font-medium text-black">Username</label>
                                <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange} class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <div class="mb-6">
                                <label for="password" class="block mb-2 text-sm font-medium text-black">Password</label>
                                <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>

                            <div>
                                {error && <p class="text-center font-bold text-red-500">{error}</p>}
                            </div>

                            <div>
                                <center>
                                    <button type="submit" class="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">LOGIN</button>
                                    <br></br><br></br>
                                    <Link href="adminRegistration" class="font-medium text-blue-400 dark:text-blue-500 hover:underline">Not Registered?</Link>
                                </center>
                            </div>
                        </form>
                    </div>
                </div>
            </body>
        </>
    );
};

export default AdminLoginForm;