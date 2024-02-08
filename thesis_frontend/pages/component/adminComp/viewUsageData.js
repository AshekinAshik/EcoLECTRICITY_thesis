import axios from "axios";
import { useEffect, useState } from "react";
import WebHeader_V1 from "../../layout/header_v1";
import WebFooter from "../../layout/footer";
import ReactApexChart from "react-apexcharts";
// import SessionCheck from "../utils/sessionCheck";

const ViewUsageData = () => {
    const [usages, setUsages] = useState([]);
    const [powerData, setPowerData] = useState([])
    const [currentData, setCurrentData] = useState([])
    const [voltageData, setVoltageData] = useState([])
    const [timeData, setTimeData] = useState([])

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const currents = []
        const powers = []
        const times = []
        const voltages = []

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
                voltages.push(item.voltage)
            })
            setPowerData(powers)
            setCurrentData(currents)
            setTimeData(times)
            setVoltageData(voltages)
        } catch (error) {
            console.error(error);
        }
    };

    const OptionsChartLine = {
        chart: {
            height: 550,
            type: 'area'
        },
        xaxis: {
            type: '',
            categories: timeData,
            tickAmount: 10,
        },
        yaxis: {
            tickAmount: 5,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        tooltip: {
            x: {
                format: 'dd/MM'
            },
        }
    }

    const SeriesChartLine = [
        {
            name: 'x',
            data: currentData
        },
        {
            name: 'y',
            data: voltageData
        }
    ]

    return (
        <>
            {/* <SessionCheck /> */}
            <body className="bg-light">
                <WebHeader_V1 />
                <div className="body-topnbottom">
                    <center>

                        <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-2xl lg:text-4xl dark:text-white"> All Available <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Usage</mark> Data </h4>
                        <br></br>

                        <ReactApexChart options={OptionsChartLine} series={SeriesChartLine} height={500} width={1400} />

                        <br></br>


                    </center>
                </div>
                <WebFooter />
            </body>
        </>
    )
};

export default ViewUsageData;