import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../layout/layout";
// import SessionCheck from "../utils/sessionCheck";

const CitizenUsages = () => {
    const router = useRouter();

    const [usages, setUsages] = useState([]);

    const c_id = router.query.id;

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'usages/' + c_id,
                {
                    withCredentials: true
                })

            setUsages(response.data);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const showData = () => {
        console.log(usages)
        if (usages) {
            return (
                <>
                    {/* <SessionCheck /> */}

                    <Layout title="Usage Data">
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
                                                    Citizen ID
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {usages.map((item, index) => (
                                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                    <td class="px-6 py-2">{item.id}</td>
                                                    <td class="px-6 py-2">{item.power}</td>
                                                    <td class="px-6 py-2">{item.current}</td>
                                                    <td class="px-6 py-2">{item.voltage}</td>
                                                    <td class="px-6 py-2">{item.time}</td>
                                                    <td class="px-6 py-2">{item.c_id}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </center>
                        </body>
                    </Layout>
                </>
            )
        } else {
            return (
                <>
                    <Layout title="Citizen Usage Data">
                        <br></br>
                        <p class="text-center text-red-700"> No Usage Data to Show </p>
                    </Layout>
                </>
            )
        }
    };

    return (
        <div>
            {showData()}
        </div>
    )
};

export default CitizenUsages;