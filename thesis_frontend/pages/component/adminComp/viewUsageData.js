import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ViewUsageData = () => {
    const router = useRouter();

    const [usageData, setUsageData] = useState([]);

    useEffect(() => {
        getUsageData();
    }, []);

    const getUsageData = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'dashboard', {
                withCredentials: true
            });

            setUsageData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log('Error Fetching Usage Data: ', error);
        }
    };

    return (
        <>
            {/* <SessionCheck /> */}

            <br></br> <br></br>
            <div>
                <body>
                    <center>

                        <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white"> All Available <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Usage</mark> Data </h4>
                        <br></br>

                        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table class="w-full text-sm text-center text-gray-800 dark:text-gray-400">
                                <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="px-6 py-5">
                                            Log ID
                                        </th>
                                        <th scope="col" class="px-6 py-5">
                                            Power
                                        </th>
                                        <th scope="col" class="px-6 py-5">
                                            Current
                                        </th>
                                        <th scope="col" class="px-6 py-5">
                                            Voltage
                                        </th>
                                        <th scope="col" class="px-6 py-5">
                                            Time
                                        </th>
                                        <th scope="col" class="px-6 py-5">
                                            Time
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {usageData.map((item, index) => (
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            <td class="px-6 py-2">{item.log_id}</td>
                                            <td class="px-6 py-2">{item.power}</td>
                                            <td class="px-6 py-2">{item.current}</td>
                                            <td class="px-6 py-2">{item.voltage}</td>
                                            <td class="px-6 py-2">{item.time}</td>
                                            <td class="px-6 py-2">{item.c_id}</td>
                                            <td class="px-6 py-2 text-right">
                                                <Link href={"" + item.c_id}>
                                                    <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> Details </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </center>
                </body>
            </div>
        </>
    );
};

export default ViewUsageData;