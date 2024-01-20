import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import WebLayout_V1 from "../../layout/layout_v1";
import MenuDrawer from "../../layout/admin_menudrawer";
import WebHeader_V1 from "../../layout/header_v1";
import WebFooter from "../../layout/footer";
import MenuDrawer_Citizen from "../../layout/citizen_menudrawer";

const GetCitizens = () => {
    const router = useRouter();

    const [citizensData, setCitizensData] = useState([]);
    const [searchData, setSearchData] = useState({
        c_id: 0,
    })

    useEffect(() => {
        getCitizensData();
    }, []);

    const handleCitizenIDChange = (e) => {
        setSearchData({ ...searchData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        searchData.c_id = parseInt(searchData.c_id);
        console.log(searchData);

        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'search/citizen/' + searchData.c_id, {
                withCredentials: true
            });

            setCitizensData(response.data)
            console.log(response.data)
        } catch (error) {
            console.error('Error Search:', error);
        }
    };

    const getCitizensData = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'citizens', {
                withCredentials: true
            });

            setCitizensData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log('Error Fetching Citizens Data: ', error);
        }
    };

    const handleRedirect = () => {
        getCitizensData()
    }

    return (
        <>
            {/* <SessionCheck /> */}

            <body className="bg-full-screen">
                <WebHeader_V1 title={"Citizen List"} />
                <MenuDrawer_Citizen />

                <div className="body-topnbottom body-sideadjustment">
                    <center>
                        <br></br> <br></br>
                        <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-2xl lg:text-4xl dark:text-white"> All Available <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Citizens</mark> List </h4>
                        <br></br>

                        <div>
                            <form onSubmit={handleSubmit}>
                                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>

                                    <input type="number" name="c_id" onChange={handleCitizenIDChange} class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by Citizen ID ..." />
                                    <button type="button" onClick={handleRedirect} class="text-grey-900 absolute right-24 bottom-2.5 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2">Full List</button>
                                    <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </form>
                            <br></br>
                        </div>

                        {/* <div>
                                <button type="button" onClick={handleRedirect} class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">See Full List</button>
                            </div> */}

                        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table class="w-full text-sm text-center text-gray-800 dark:text-gray-400">
                                <thead class="text-extrabold text-gray-700 uppercase bg-green-200 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="px-6 py-5">
                                            Citizen ID
                                        </th>
                                        <th scope="col" class="px-6 py-5">
                                            Name
                                        </th>
                                        <th scope="col" class="px-6 py-5">
                                            {/* for filling the gap */}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {citizensData.map((item, index) => (
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            <td class="px-6 py-2">{item.c_id}</td>
                                            <td class="px-6 py-2">{item.name}</td>
                                            <td class="px-6 py-2 text-right">
                                                <Link href={"" + item.c_id}>
                                                    <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-green-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> Usages </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                {/* {searchData.c_id === 0 ? (
                                    <tbody>
                                        {citizensData.map((item, index) => (
                                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                <td class="px-6 py-2">{item.c_id}</td>
                                                <td class="px-6 py-2">{item.name}</td>
                                                <td class="px-6 py-2 text-right">
                                                    <Link href={"" + item.c_id}>
                                                        <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> Usages </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>) : (
                                    <tbody>
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            <td class="px-6 py-2">{searchedCitizenData.id}</td>
                                            <td class="px-6 py-2">{searchedCitizenData.name}</td>
                                            <td class="px-6 py-2 text-right">
                                                <Link href={"" + searchedCitizenData.c_id}>
                                                    <button type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> Usages </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                )} */}
                            </table>
                        </div>
                    </center>
                </div>
            </body>
            <WebFooter />
        </>
    );
};

export default GetCitizens;