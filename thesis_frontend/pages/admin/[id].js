import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../layout/layout";
import ReactApexChart from "react-apexcharts";
import { Catamaran } from "next/font/google";
// import SessionCheck from "../utils/sessionCheck";

const CitizenUsages = () => {
    const router = useRouter();

    const [usages, setUsages] = useState([]);

    // const [category, setCategory] = useState([])
    // const [data, setData] = useState([])

    const [powerData, setPowerData] = useState([])
    const [currentData, setCurrentData] = useState([])
    const [timeData, setTimeData] = useState([])

    const c_id = router.query.id;

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const currents = []
        const powers = []
        const times = []

        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'usages/' + c_id,
                {
                    withCredentials: true
                })

            setUsages(response.data);
            console.log("response: ", response);

            response.data.map(item => {
                console.log("item: ", item)
                currents.push(item.current)
                powers.push(item.power)
                times.push(item.time)
            })
            setPowerData(powers)
            setCurrentData(currents)
            setTimeData(times)

            console.log("current, power and time: ", currents, powers, times)
            console.log(typeof times[0])
        } catch (error) {
            console.error(error);
        }
    };


    // let i = 0
    // let powers = []
    // let currents = []
    // usages.map((item, index) => (
    //     powers[i] = item.power,
    //     currents[i] = item.current,
    //     i = i + 1
    // ))


    // let powers = [0, 0];
    // let currents = [0, 0];
    // for (let i = 0; i < usages.length; i++) {
    //     powers[i] = usages[i].power;
    //     currents[i] = usages[i].current;
    // }
    // console.log(powers)
    // let cur = [31.1, 40.7, 28, 51]
    // console.log(cur)
    // console.log(currents)

    // const [state, setState] = useState({
    //     series: [
    //         {
    //             name: 'current',
    //             // data: currents
    //         },
    //         {
    //             name: 'power',
    //             // data: powers
    //         }
    //     ],
    //     options: {
    //         chart: {
    //             height: 350,
    //             type: 'area'
    //         },
    //         dataLabels: {
    //             enabled: true
    //         },
    //         stroke: {
    //             curve: 'smooth'
    //         },
    //         xaxis: {
    //             type: 'datetime',
    //             categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z"]
    //         },
    //         tooltip: {
    //             x: {
    //                 format: 'dd/MM/yy HH:mm'
    //             },
    //         },
    //     },
    // })

    const showData = () => {
        setInterval(getData, 5000)
        
        console.log(usages)
        if (usages) {
            return (
                <>
                    {/* <SessionCheck /> */}

                    <Layout >
                        <body>
                            <center>

                                <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white"> All Available <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Usage</mark> Data </h4>
                                <br></br>

                                {/* <ReactApexChart options={state.options} series={state.series} type="area" height={350} width={1000} /> */}

                                <ReactApexChart
                                    options={{
                                        chart: {
                                            id: 'apexchart-example',
                                            height: 350,
                                            type: 'area'
                                        },
                                        xaxis: {
                                            type: '',
                                            categories: timeData
                                        },
                                        dataLabels: {
                                            enabled: true
                                        },
                                        stroke: {
                                            curve: 'smooth'
                                        },
                                        tooltip: {
                                            x: {
                                                format: 'dd/MM'
                                            },
                                        },
                                    }}
                                    series={[
                                        {
                                            name: 'Current',
                                            data: currentData
                                        },
                                        {
                                            name: 'Power',
                                            data: powerData
                                        }
                                    ]}
                                    type="area" height={350} width={1000} />
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
                                            {
                                                usages.map((item, index) => (
                                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                        <td class="px-6 py-2">{item.id}</td>
                                                        <td class="px-6 py-2">{item.power}</td>
                                                        <td class="px-6 py-2">{item.current}</td>
                                                        <td class="px-6 py-2">{item.voltage}</td>
                                                        <td class="px-6 py-2">{item.time}</td>
                                                        <td class="px-6 py-2">{item.c_id}</td>
                                                    </tr>
                                                ))
                                            }
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

    // return (
    //     <>
    //         <ReactApexChart
    //             options={{
    //                 chart: {
    //                     id: 'apexchart-example'
    //                 },
    // xaxis: {
    //     type: 'datetime',
    //     categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z"]
    // }
    //             }}
    //             series={[
    //                 {
    //                     name: 'series-1',
    //                     data: data
    //                 },
    //                 {
    //                     name: 'series-2',
    //                     data: category
    //                 }
    //             ]}
    //             type="area" height={350} width={1000} />
    //     </>
    // )
};

export default CitizenUsages;
